
const htmlOuter = inner => `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang xml:lang>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
  <title>Photo Album</title>
  <style>
    code{white-space: pre-wrap;}
    span.smallcaps{font-variant: small-caps;}
    span.underline{text-decoration: underline;}
    div.column{display: inline-block; vertical-align: top; width: 50%;}
    div.hanging-indent{margin-left: 1.5em; text-indent: -1.5em;}
    ul.task-list{list-style: none;}
    .display.math{display: block; text-align: center; margin: 0.5rem auto;}
  </style>
</head>
<body>
${inner}
</body>
</html>
`;

let images = [];

function download() {
  const elHtml = preview.innerHTML;
  const link = document.createElement('a');
  const mimeType = 'text/plain';
  link.download = `${(new Date()).toISOString()}-photobook.html`;
  link.href = 'data:'
    + mimeType
    +  ';charset=utf-8,'
    + encodeURIComponent(htmlOuter(elHtml));
  link.click();
  URL.revokeObjectURL(link.href);
}

function addimages() {
  const files = image.files;
  for (let i = 0; i < files.length; i++) {
      addimage(files[i]);
  }
}

function renderImages() {
  preview.innerHTML = '';
  images.forEach(x => {
//    const deleteButton = document.createElement('button');
    x.style.maxHeight = '100%';
    x.style.maxWidth = '100%';
    x.style.paddingTop = '1em';
    preview.appendChild(x)
  });
}

function addimage(file) {
  const img = new Image;
  const fr = new FileReader;
  fr.onload = () => {img.src = fr.result};
  fr.readAsDataURL(file);
  img.onload = () => {
    images.push(img);
    renderImages();
  }
}

