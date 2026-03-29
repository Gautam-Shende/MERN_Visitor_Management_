
import pdf from 'html-pdf'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// import nodemailer from "nodemailer"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const generatePassPDF = async (data) => {
    return new Promise((resolve, reject) => {

        const templatePath = path.join(__dirname, './pass-template.html');
        
        let html = fs.readFileSync(templatePath, 'utf-8')
        
        html = html.replace(/{{company_name}}/g, data.company_name)
        html = html.replace(/{{visitor_name}}/g, data.visitor_name)
        html = html.replace(/{{visitor_email}}/g, data.visitor_email)
        html = html.replace(/{{visitor_phone}}/g, data.visitor_phone)
        html = html.replace(/{{visit_date}}/g, data.visit_date)
        html = html.replace(/{{visit_time}}/g, data.visit_time)
        html = html.replace(/{{host_name}}/g, data.host_name)
        // html = html.replace(/{{qr_code}}/g, data.qr)
        html = html.replace(/{{qr_code}}/g, data.qr_code)
        html = html.replace(/{{pass_id}}/g, data.pass_id)
        html = html.replace(/{{generated_date}}/g, data.generated_date)
        
        const options = {
            format: 'A4',
            border: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        };
        
        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) reject(err)
            else resolve(buffer)
        })
    })
}