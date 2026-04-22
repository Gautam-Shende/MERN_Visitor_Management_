
import pdf from "html-pdf"
import fs from "fs"
import path from "path"

import { fileURLToPath } from "url"

// ES module for file uploading used
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const generatePassPDF = (data) => {
  return new Promise((resolve, reject) => {

    const templatePath = path.join(__dirname, "..", "templates", "pass-template.html")
    let html = fs.readFileSync(templatePath, "utf-8")

    // fileds for html 
    const fields = {
      company_name: data.company_name || "Visitor Pass",
      visitor_name: data.visitor_name || "Visitor",
      visitor_email: data.visitor_email || "-",
      visitor_phone: data.visitor_phone || "-",
      visit_date: data.visit_date || "-",
      visit_time: data.visit_time || "-",
      host_name: data.host_name || "-",
      qr_code: data.qr_code || "",
      pass_id: data.pass_id || "-",
      generated_date: data.generated_date || new Date().toLocaleString(),
    }

    for (const [key, val] of Object.entries(fields)) {
      html = html.replaceAll(`{{${key}}}`, val)
    }

    const options = {
      format: "A4",
      border: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      timeout: 30000, 
    }

    pdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        console.error("PDF generation error:", err)
        return reject(err)
      }

      // Send back the generated PDF buffer
      resolve(buffer)
    })
  })
}