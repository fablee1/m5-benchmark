import PdfPrinter from "pdfmake"
import imageToBase64 from "image-to-base64"

const getImageB64FromUrl = async (url) => {
  const b64 = await imageToBase64(url)
  return b64
}

export const generatePDFReadableStream = async (media) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-Oblique",
    },
  }

  const printer = new PdfPrinter(fonts)

  const docDefinition = {
    content: [
      {
        image: "data:image/jpeg;base64," + (await getImageB64FromUrl(media.cover)),
        width: 500,
      },
    ],
  }
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()
  return pdfReadableStream
}
