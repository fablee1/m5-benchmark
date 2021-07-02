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
      {
        text: media.title,
        style: "header",
      },
      ...media.reviews.map((r, idx) => {
        return {
          text: `Review ${idx + 1}: ${r.comment}\nRate: ${r.rate}/5`,
          margin: [20, 20],
        }
      }),
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        alignment: "center",
        margin: [20, 20],
      },
    },
  }
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()
  return pdfReadableStream
}
