//get the organization name for the search feature, everything starting from row 2, and in column 1
function getDataForSearch() {
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Receipients");
  return ws.getRange(3, 1, ws.getLastRow() - 2, 1).getValues();
}

//delete organizaiton functionality
function deleteByOrgName(name) {
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Receipients");
  const orgIds = ws.getRange(2, 1, ws.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase()); //map org name column to array
  const posIndex = orgIds.indexOf(name.toString().toLowerCase());
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
  ws.deleteRow(rowNumber);
}

//this will copy all the organization data to the "edit organization" tab when you click on the edit button on the search tab.
function getOrgByName(name) {
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Receipients");
  const orgIds = ws.getRange(2, 1, ws.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase()); //map org name column to array
  const posIndex = orgIds.indexOf(name.toString().toLowerCase());
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
  const organizationInfo = ws.getRange(rowNumber, 1, 1, 8).getValues()[0];
  //const organizationInfo2 = ws.getRange(rowNumber, 20, 1, 2).getValues()[0];
  return {
    orgName: organizationInfo[0], orgContact: organizationInfo[1], orgOwner: organizationInfo[2], orgLocation: organizationInfo[3],
    orgBagReq: organizationInfo[4], orgBagDist: organizationInfo[5], orgPickDel: organizationInfo[6], orgNotes: organizationInfo[7] 
  };
}

//function that will edit the sheet data based on the input on the "edit organization tab"
function editOrgByName(name, organizationInfo) {

  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Recipients");
  const orgIds = ws.getRange(2, 1, ws.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase()); //map org name column to array
  const posIndex = orgIds.indexOf(name.toString().toLowerCase());
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
  ws.getRange(rowNumber, 2, 1, 6).setValues([[organizationInfo.orgContact, organizationInfo.orgOwner,
  organizationInfo.orgLocation, organizationInfo.orgBagReq,
  organizationInfo.orgBagDist, organizationInfo.orgNotes]]);
  return true;

}

//function to add a new organization to the bottom of the sheet
function addOrganization(organizationInfo, list, pick_del) {

  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Receipients");
  const lastRow = ws.getLastRow() + 1;
  const rowNumber = lastRow;
  ws.getRange(rowNumber, 1, 1, 7).setValues([[organizationInfo.orgName, organizationInfo.orgContact,
  organizationInfo.orgOwner, organizationInfo.orgLocation,
  organizationInfo.orgBagReq, organizationInfo.orgBagDist, organizationInfo.orgNotes]]);
  ws.getRange(rowNumber, 7, 1, 1).setValue(pick_del);
  ws.getRange(rowNumber, 9, 1, 11).insertCheckboxes();

  if (list.includes("HandS")) {
    ws.getRange(rowNumber, 9, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("Wipes")) {
    ws.getRange(rowNumber, 10, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("Masks")) {
    ws.getRange(rowNumber, 11, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("BandAid")) {
    ws.getRange(rowNumber, 12, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("Treat")) {
    ws.getRange(rowNumber, 13, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("PersonalItemR")) {
    ws.getRange(rowNumber, 14, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("PencilR")) {
    ws.getRange(rowNumber, 15, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("BrownBagR")) {
    ws.getRange(rowNumber, 16, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("CompleteBagR")) {
    ws.getRange(rowNumber, 17, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("ExtraR")) {
    ws.getRange(rowNumber, 18, 1, 1).insertCheckboxes().check();
  }
  if (list.includes("PostcardR")) {
    ws.getRange(rowNumber, 19, 1, 1).insertCheckboxes().check();
  }

  
  
  ws.getRange(rowNumber,20,1,1).insertCheckboxes().setValue(organizationInfo.orgNew)
  ws.getRange(rowNumber,21,1,1).insertCheckboxes().setValue(organizationInfo.orgWeb)
  return true;
}

function addDonation(donationInfo) {

  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Item Donations");
  const lastRow = ws.getLastRow() + 1;
  const rowNumber = lastRow;
  var formulaCell = ws.getRange("H1");
  var formula = formulaCell.getFormulaR1C1();

  ws.getRange(rowNumber, 4, 1, 4).setValues([[donationInfo.donName, donationInfo.donContact, donationInfo.donItem, donationInfo.donCat]]);
  
  ws.getRange(rowNumber, 2, 1, 1).setValue(donationInfo.donNumber);
  ws.getRange(rowNumber, 8, 1, 1).setFormulaR1C1(formula);
  ws.getRange(rowNumber,9,1,1).insertCheckboxes().setValue(donationInfo.donNew)

  const bagsWS = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Donation Tally");
  const bagsLastRow = bagsWS.getLastRow() + 1;
  const bagsRowNumber = bagsLastRow;
  var formulaCells = bagsWS.getRange("B4:L4");
  var formulas = formulaCells.getFormulasR1C1();

  tempArray = bagsWS.getRange(4, 1, bagsWS.getLastRow(), 1).getValues();
  var donorsArray = [].concat.apply([], tempArray);

  if (!(donorsArray.includes(donationInfo.donName))) {
    bagsWS.getRange(bagsRowNumber, 1, 1, 1).setValue(donationInfo.donName);
    for (let i = 0; i < 11; i++) {
      bagsWS.getRange(bagsRowNumber, i + 2, 1, 1).setFormulaR1C1(formulas[0][i]);
    }
  }

  return true;
}

function addBag(bagList, bagReceipient, numBags) {
  result = true;

  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bags");
  const lastRow = ws.getLastRow() + 1;
  const rowNumber = lastRow;

  hs = ws.getRange(3, 3, 1, 1).getValue();
  dw = ws.getRange(3, 4, 1, 1).getValue();
  mk = ws.getRange(3, 5, 1, 1).getValue();
  ba = ws.getRange(3, 6, 1, 1).getValue();
  tt = ws.getRange(3, 7, 1, 1).getValue();
  pi = ws.getRange(3, 8, 1, 1).getValue();
  pe = ws.getRange(3, 9, 1, 1).getValue();
  bb = ws.getRange(3, 10, 1, 1).getValue();
  cb = ws.getRange(3, 11, 1, 1).getValue();
  em = ws.getRange(3, 12, 1, 1).getValue();
  pc = ws.getRange(3, 13, 1, 1).getValue();

  if (Number(bagList.handSS) + Number(bagList.disWipes) != numBags) {
    throw Error;
  }
  if (Number(bagList.maskss) + Number(bagList.bandaidd) != numBags) {
    throw Error;
  }
  if (Number(bagList.treatt) != numBags || Number(bagList.personalItem) != numBags || Number(bagList.pencilEraser) != numBags
    || Number(bagList.brownbagg) != numBags || Number(bagList.completebagg) != numBags || Number(bagList.postCardd) != numBags) {
    throw Error;
  }
  if (Number(bagList.handSS) > hs || Number(bagList.disWipes) > dw || Number(bagList.maskss) > mk || Number(bagList.bandaidd > ba) ||
    Number(bagList.treatt) > tt || Number(bagList.personalItem) > pi || Number(bagList.pencilEraser) > pe
    || Number(bagList.brownbagg) > bb || Number(bagList.completebagg) > cb || Number(bagList.extraMisc) > em || Number(bagList.postCardd) > pc) {
    throw Error;
  }

  ws.getRange(rowNumber, 1, 1, 1).setValue(bagReceipient);
  ws.getRange(rowNumber, 2, 1, 1).setValue(numBags);
  ws.getRange(rowNumber, 3, 1, 11).setValues([[bagList.handSS, bagList.disWipes, bagList.maskss, bagList.bandaidd,
  bagList.treatt, bagList.personalItem, bagList.pencilEraser, bagList.brownbagg,
  bagList.completebagg, bagList.extraMisc, bagList.postCardd]]);

  const donationsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Item Donations");
  var dataRange = donationsSheet.getRange("B4:G100");
  var data = dataRange.getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "Masks" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.maskss);
      if (totalValue > data[i][0]) {
        bagList.maskss = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.maskss)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "Hand Sanitizer" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.handSS);
      if (totalValue > data[i][0]) {
        bagList.handSS = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.handSS)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "Disinfecting Wipes" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.disWipes);
      if (totalValue > data[i][0]) {
        bagList.disWipes = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.disWipes)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "Band Aids" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.bandaidd);
      if (totalValue > data[i][0]) {
        bagList.bandaidd = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.bandaidd)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "Treat" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.treatt);
      if (totalValue > data[i][0]) {
        bagList.treatt = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.treatt)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "Personalized Item" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.personalItem);
      if (totalValue > data[i][0]) {
        bagList.personalItem = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.personalItem)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "Pencil/Eraser" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.personalItem);
      if (totalValue > data[i][0]) {
        bagList.personalItem = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.personalItem)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "BrownBags" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.brownbagg);
      if (totalValue > data[i][0]) {
        bagList.brownbagg = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.brownbagg)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "Complete Bags" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.completebagg);
      if (totalValue > data[i][0]) {
        bagList.completebagg = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.completebagg)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "Extra/Misc" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.extraMisc);
      if (totalValue > data[i][0]) {
        bagList.extraMisc = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.extraMisc)));
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i][5] == "OH PostCard" && (data[i][1] < data[i][0])) {
      totalValue = donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.postCardd);
      if (totalValue > data[i][0]) {
        bagList.postCardd = (totalValue - data[i][0]);
        donationsSheet.getRange(i + 4, 3, 1, 1).setValue((data[i][0]));
        continue;
      }
      donationsSheet.getRange(i + 4, 3, 1, 1).setValue((donationsSheet.getRange(i + 4, 3, 1, 1).getValue() + Number(bagList.postCardd)));
      break;
    }
  }

  return true;
}
