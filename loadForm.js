function doGet(e) {
  if (!e.parameter.page) 
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('mainPage');
    htmlOutput.message = '';
    return htmlOutput.evaluate();
  }
  else if(e.parameter['page'] == 'Link1')
  {
    Logger.log(JSON.stringify(e));
    var htmlOutput =  HtmlService.createTemplateFromFile('main');
    return htmlOutput.evaluate();  
  }
  else if(e.parameter['page'] == 'Link2')
  {
    Logger.log(JSON.stringify(e));
    var htmlOutput =  HtmlService.createTemplateFromFile('mainDonations');
    return htmlOutput.evaluate();  
  }
  else if(e.parameter['page'] == 'Link3')
  {
    Logger.log(JSON.stringify(e));
    var htmlOutput =  HtmlService.createTemplateFromFile('bags');
    return htmlOutput.evaluate();  
  }
}

function getUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}