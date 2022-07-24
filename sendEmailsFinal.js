function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Send Emails Final')
      .addItem('Send Emails', 'SendDonationEmails')
      .addToUi();
}

  /** psuedo
   * create html from google doc
   * for each row in sheet (starting from row 3)
   *  if Status is pending and contact is available
   *    temphtml = html
   *    temphtml replace placeholders
   *    send email
   *    update Status
   * 
   */

  /**
   *  sheet name and googleDoc are hard coded, check appropriate names/id (eg. ItemDonations vs Item donations)
   *  subject is hard coded.
   *  row,col values are hardcoded for "Item Donations" sheet
   *  script checks status by string "Pending" to enable emails. replace as necessory
   *  
   *  tempHtmlTemplate.replace() calls do not have error handling, implement as necessory
   *  script updates the status, comment out for testing or original values are lost. line 70.  
   */


function SendDonationEmails() {
  console.log("starting script");

  // hard coded sources
  const sheetName = "ItemDonations";
  const templateDocumentId = "1EFUk3hjFjc9YL2npWcleH5wUXCfP4VGBCbj5ldQ11Yk";
  
  // hard coded subject
  const subject = "This is my subject";

  // create html from google doc
  var [htmlTemplate,inlineimages] = ConvertGoogleDocToCleanHtml(templateDocumentId);
   
  // send emails
  var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Item Donations');
  var dataRange = activeSheet.getDataRange();
  var data = dataRange.getValues();
  for (var row = 3;row<data.length;row++) {  // row 3 is where the data begins
    
    var status = data[row][7];
    if (status == "Pending" && data[row][4]) { 
      console.log(data[row]);
      var dataRow = data[row];
      var emailAddress = data[row][4];
      tempHtmlTemplate = htmlTemplate;

      // replace placeholders
      var totalItems = dataRow[1];
      tempHtmlTemplate = tempHtmlTemplate.replace("{{TotalItems}}", (totalItems)? totalItems : "NONE");
      var itemsUsed = dataRow[2];
      tempHtmlTemplate = tempHtmlTemplate.replace("{{ItemsUsed}}", (itemsUsed)? itemsUsed : "NONE");
      var donorName = dataRow[3];
      tempHtmlTemplate = tempHtmlTemplate.replace("{{DonorName}}", (donorName)? donorName : "NONE");
      var items = dataRow[5];
      tempHtmlTemplate = tempHtmlTemplate.replace("{{Items}}", (items)? items : "NONE");
      var category = dataRow[6];
      tempHtmlTemplate = tempHtmlTemplate.replace("{{Category}}", (category)? category : "NONE");

      // send email
      console.log("sending email to ",donorName);
      emailHtml(emailAddress, subject, tempHtmlTemplate, inlineimages);
      
      // create doc with html
      // createDocumentForHtml(html, images);

      // update status
      activeSheet.getRange(row+1,8).setValue("Email Sent");
    }
  }
  
  
}
function ConvertGoogleDocToCleanHtml(templateDocumentId) {
  console.log("creating html from google doc");
  var body = DocumentApp.openById(templateDocumentId);
  var numChildren = body.getNumChildren();
  var output = [];
  var images = [];
  var listCounters = {};

  // Walk through all the child elements of the body.
  for (var i = 0; i < numChildren; i++) {
    var child = body.getChild(i);
    output.push(processItem(child, listCounters, images));
  }
  var html = output.join('\r');
  
  var inlineImages = {};
  for (var j=0; j<images.length; j++) {
    inlineImages[[images[j].name]] = images[j].blob;
  }
  return [html,inlineImages]
}

function emailHtml(email, subject, html, inline) {
  // take images as input for attachment creation
  // var attachments = [];
  // for (var j=0; j<images.length; j++) {
  //   attachments.push( {
  //     "fileName": images[j].name,
  //     "mimeType": images[j].type,
  //     "content": images[j].blob.getBytes() } );
  // }
  // attachments.push({"fileName":name, "mimeType": "text/html", "content": html});
  
  MailApp.sendEmail({
     to: email,
     subject: subject,
     htmlBody: html,
     inlineImages: inline
    //  attachments: attachments
   });
}

function createDocumentForHtml(html, images) {
  var name = DocumentApp.getActiveDocument().getName()+".html";
  
  var newDoc = DocumentApp.create(name);
  newDoc.getBody().setText(html);
  // for(var j=0; j < images.length; j++)
  //   newDoc.getBody().appendImage(images[j].blob);
  newDoc.saveAndClose();
}

function dumpAttributes(atts) {
  // Log the paragraph attributes.
  for (var att in atts) {
    // Logger.log(att + ":" + atts[att]);
  }
}

function processItem(item, listCounters, images) {
  var output = [];
  var prefix = "", suffix = "";
  // console.log("item type -> ",item.getType().toString())
  
  if (item.getType() == DocumentApp.ElementType.PARAGRAPH) {
    switch (item.getHeading()) {
        // Add a # for each heading level. No break, so we accumulate the right number.
      case DocumentApp.ParagraphHeading.HEADING6: 
        prefix = "<h6>", suffix = "</h6>"; break;
      case DocumentApp.ParagraphHeading.HEADING5: 
        prefix = "<h5>", suffix = "</h5>"; break;
      case DocumentApp.ParagraphHeading.HEADING4:
        prefix = "<h4>", suffix = "</h4>"; break;
      case DocumentApp.ParagraphHeading.HEADING3:
        prefix = "<h3>", suffix = "</h3>"; break;
      case DocumentApp.ParagraphHeading.HEADING2:
        prefix = "<h2>", suffix = "</h2>"; break;
      case DocumentApp.ParagraphHeading.HEADING1:
        prefix = "<h1>", suffix = "</h1>"; break;
      default: 
        prefix = "<p style='margin-bottom:0; margin : 0; padding-top:0;'>", suffix = "</p>";
    }
    if (item.getNumChildren() == 0) {
      // console.log("paragraph empty");
      prefix = "<p style='margin-bottom:0; margin : 0; padding-top:0;'><br>", suffix = "</p>";
      output.push(prefix+suffix)
      return output.join('');
    }
  }
  else if (item.getType() == DocumentApp.ElementType.INLINE_IMAGE)
  {
    
    processImage(item, images, output);
  }
  else if (item.getType()===DocumentApp.ElementType.LIST_ITEM) {
    var listItem = item;
    var gt = listItem.getGlyphType();
    var key = listItem.getListId() + '.' + listItem.getNestingLevel();
    var counter = listCounters[key] || 0;

    // First list item
    if ( counter == 0 ) {
      // Bullet list (<ul>):
      if (gt === DocumentApp.GlyphType.BULLET
          || gt === DocumentApp.GlyphType.HOLLOW_BULLET
          || gt === DocumentApp.GlyphType.SQUARE_BULLET) {
        prefix = '<ul><li>', suffix = "</li>";

          suffix += "</ul>";
        }
      else {
        // Ordered list (<ol>):
        prefix = "<ol><li>", suffix = "</li>";
      }
    }
    else {
      prefix = "<li>";
      suffix = "</li>";
    }

    if (item.isAtDocumentEnd() || (item.getNextSibling() && (item.getNextSibling().getType() != DocumentApp.ElementType.LIST_ITEM))) {
      if (gt === DocumentApp.GlyphType.BULLET
          || gt === DocumentApp.GlyphType.HOLLOW_BULLET
          || gt === DocumentApp.GlyphType.SQUARE_BULLET) {
        suffix += "</ul>";
      }
      else {
        // Ordered list (<ol>):
        suffix += "</ol>";
      }

    }

    counter++;
    listCounters[key] = counter;
  }

  output.push(prefix);

  if (item.getType() == DocumentApp.ElementType.TEXT) {
    // console.log("item type -> ",item.getType().toString())
    processText(item, output);
  }
  else {
    if (item.getNumChildren) {
      var numChildren = item.getNumChildren();

      // Walk through all the child elements of the child.
      for (var i = 0; i < numChildren; i++) {
        var child = item.getChild(i);
        output.push(processItem(child, listCounters, images));
      }
    }

  }

  output.push(suffix);
  return output.join('');
}


function processText(item, output) {
  var text = item.getText();
  var indices = item.getTextAttributeIndices();
  if (indices.length <= 1) {
    // Assuming that a whole para fully italic is a quote
    if(item.isBold()) {
      output.push('<strong>' + text + '</strong>');
    }
    else if(item.isItalic()) {
      output.push('<blockquote>' + text + '</blockquote>');
    }
    else if (text.trim().indexOf('http://') == 0) {
      output.push('<a href="' + text + '" rel="nofollow">' + text + '</a>');
    }
    else if (text.trim().indexOf('https://') == 0) {
      output.push('<a href="' + text + '" rel="nofollow">' + text + '</a>');
    }
    else {
      output.push(text);
    }
  }
  else {

    for (var i=0; i < indices.length; i ++) {
      var partAtts = item.getAttributes(indices[i]);
      var startPos = indices[i];
      var endPos = i+1 < indices.length ? indices[i+1]: text.length;
      var partText = text.substring(startPos, endPos);
    
      if (partAtts.ITALIC) {
        output.push('<i>');
      }
      if (partAtts.BOLD) {
        output.push('<strong>');
      }
      if (partAtts.UNDERLINE) {
        output.push('<u>');
      }

      // If someone has written [xxx] and made this whole text some special font, like superscript
      // then treat it as a reference and make it superscript.
      // Unfortunately in Google Docs, there's no way to detect superscript
      if (partText.indexOf('[')==0 && partText[partText.length-1] == ']') {
        output.push('<sup>' + partText + '</sup>');
      }
      else if (partText.trim().indexOf('http://') == 0) {
        output.push('<a href="' + partText + '" rel="nofollow">' + partText + '</a>');
      }
      else if (partText.trim().indexOf('https://') == 0) {
        output.push('<a href="' + partText + '" rel="nofollow">' + partText + '</a>');
      }
      // accomodate a hyperlink
      else if (item.asText().getLinkUrl(indices[i])) {
        link = item.asText().getLinkUrl(indices[i]);
        output.push('<a href="' + link + '">' + partText + '</a>');
      }
      else {
        output.push(partText);
      }

      if (partAtts.ITALIC) {
        output.push('</i>');
      }
      if (partAtts.BOLD) {
        output.push('</strong>');
      }
      if (partAtts.UNDERLINE) {
        output.push('</u>');
      }

    }
  }
}


function processImage(item, images, output)
{
  
  images = images || [];
  var blob = item.getBlob();
  var contentType = blob.getContentType();
  var extension = "";
  if (/\/png$/.test(contentType)) {
    extension = ".png";
  } else if (/\/gif$/.test(contentType)) {
    extension = ".gif";
  } else if (/\/jpe?g$/.test(contentType)) {
    extension = ".jpg";
  } else {
    throw "Unsupported image type: "+contentType;
  }
  var imagePrefix = "Image_";
  var imageCounter = images.length;
  var name = imagePrefix + imageCounter + extension;
  imageCounter++;

  var width = item.asInlineImage().getWidth();
  var height = item.asInlineImage().getHeight();
  var link = item.asInlineImage().getLinkUrl();
  var b = '<img src="cid:'+name+'" style="height:'+height+'px;width:'+width+'px;">';
  if (link) {
    var a = '<a href="'+link+'">';
    var c = '</a>';
    output.push( a + b + c );
  }
  else {
    output.push(b);
  }
  
  images.push( {
    "blob": blob,
    "type": contentType,
    "name": name});
}
