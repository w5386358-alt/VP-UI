const SHEET_NAMES = ['秉宸', '湘昀', '仔仔', '柏麟', '玉英'];
const ACCESS_SHEET_NAME = '歸屬權限總表';
const USER_SHEET_NAME = '登入帳號表';

function doGet() {
  ensureSystemSheets_();
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('VAIOS 查詢系統')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function ensureSystemSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let accessSheet = ss.getSheetByName(ACCESS_SHEET_NAME);
  if (!accessSheet) {
    accessSheet = ss.insertSheet(ACCESS_SHEET_NAME);
    accessSheet.getRange(1, 1, 1, 2).setValues([['購買人', '歸屬']]);
    accessSheet.setFrozenRows(1);
  }

  let userSheet = ss.getSheetByName(USER_SHEET_NAME);
  if (!userSheet) {
    userSheet = ss.insertSheet(USER_SHEET_NAME);
    userSheet.getRange(1, 1, 1, 5).setValues([['帳號', '密碼', '權限角色', '可查歸屬', '是否啟用']]);
    userSheet.getRange(2, 1, 1, 5).setValues([['admin', '1234', '管理員', 'ALL', true]]);
    userSheet.setFrozenRows(1);
  }
}

function login(username, password) {
  ensureSystemSheets_();
  const user = getLoginUser_(username, password);

  if (!user) {
    return {
      ok: false,
      message: '帳號或密碼錯誤，或此帳號未啟用'
    };
  }

  return {
    ok: true,
    user: {
      username: user.username,
      role: user.role,
      scope: user.scope,
      isAdmin: user.isAdmin
    }
  };
}

function searchBuyer(keyword, sessionUser) {
  ensureSystemSheets_();

  const name = String(keyword || '').trim();
  if (!name) {
    return {
      ok: false,
      message: '請輸入購買人姓名',
      keyword: '',
      totalCount: 0,
      serials: []
    };
  }

  if (!sessionUser || !sessionUser.username) {
    return {
      ok: false,
      message: '請先登入'
    };
  }

  const accessMap = getAccessMap_();
  const buyerBelong = normalize_(accessMap[name] || '');

  const isAdmin = !!sessionUser.isAdmin;
  const userScope = normalize_(sessionUser.scope || '');

  if (!isAdmin) {
    if (!buyerBelong || buyerBelong !== userScope) {
      return {
        ok: true,
        keyword: name,
        totalCount: 0,
        serials: [],
        message: '你沒有權限查看此購買人資料'
      };
    }
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const serials = [];

  SHEET_NAMES.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return;

    const values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();

    values.forEach((row, idx) => {
      if (normalize_(row[1]) === normalize_(name)) {
        const serial = safeText_(row[2]);
        if (!serial) return;

        serials.push({
          serial: serial,
          sheetName: sheetName,
          rowNumber: idx + 2,
          used: normalize_(row[3]) === 'USED'
        });
      }
    });
  });

  return {
    ok: true,
    keyword: name,
    totalCount: serials.length,
    serials: serials,
    message: serials.length ? '' : '查無符合資料'
  };
}

function getLoginUser_(username, password) {
  const u = String(username || '').trim();
  const p = String(password || '').trim();
  if (!u || !p) return null;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(USER_SHEET_NAME);
  if (!sheet) return null;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    const usernameCell = safeText_(row[0]);
    const passwordCell = safeText_(row[1]);
    const roleCell = safeText_(row[2]);
    const scopeCell = safeText_(row[3]);
    const enabledCell = row[4];

    const isEnabled = String(enabledCell).toLowerCase() === 'true' || enabledCell === true || String(enabledCell) === '1';

    if (normalize_(usernameCell) === normalize_(u) &&
        passwordCell === p &&
        isEnabled) {
      return {
        username: usernameCell,
        role: roleCell || '一般使用者',
        scope: scopeCell || '',
        isAdmin: normalize_(roleCell) === normalize_('管理員') || normalize_(scopeCell) === 'ALL'
      };
    }
  }

  return null;
}

function getAccessMap_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCESS_SHEET_NAME);
  const map = {};
  if (!sheet) return map;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return map;

  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  values.forEach(row => {
    const buyer = safeText_(row[0]);
    const belong = safeText_(row[1]);
    if (buyer) {
      map[buyer] = belong;
    }
  });

  return map;
}

function normalize_(value) {
  return String(value || '').trim().replace(/\s+/g, '');
}

function safeText_(value) {
  return String(value == null ? '' : value).trim();
}


function toggleUsedStatus(sheetName, rowNumber) {
  ensureSystemSheets_();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return { ok: false, message: '找不到工作表' };
  }

  const row = Number(rowNumber);
  if (!row || row < 2) {
    return { ok: false, message: '資料列錯誤' };
  }

  const cell = sheet.getRange(row, 4);
  const currentValue = safeText_(cell.getValue());
  const nextUsed = currentValue !== 'USED';

  cell.setValue(nextUsed ? 'USED' : '');

  return {
    ok: true,
    used: nextUsed
  };
}
