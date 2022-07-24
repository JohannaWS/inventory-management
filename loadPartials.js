function loadPartialHTML_(partial) {
  const htmlServ = HtmlService.createTemplateFromFile(partial);
  return htmlServ.evaluate().getContent();
}

function loadSearchView(){

  return loadPartialHTML_("search")

}

function loadOrganizationView(){

  return loadPartialHTML_("addOrganization")

}

function loadEditOrganizationView(){

  return loadPartialHTML_("editOrganization")

}

