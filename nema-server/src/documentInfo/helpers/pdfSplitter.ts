export function splitPdf(pdfFile: File): Promise<File[]> {
  //   TODO: PDF_INDEXING - Split the pdf file into multiple pdf files. One for each page
  //  1. We can use pdf-lib to split the pdf file
  //  2. We can use pdf.js to split the pdf file
  // We then need to upload the split pdf files to s3
  // We can upload to location`${spaceId}/split-pdf-uploads/${namespace}/${slugify(fileName)}/${file_page}.pdf`,

  // return the list of urls of the split pdf files
  return [];
}
