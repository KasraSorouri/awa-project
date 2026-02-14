
import puppeteer, {Browser, Page} from 'puppeteer';

const convertToPDF = async (content: string): Promise<Buffer> => {
    
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                html, body {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }
                body { 
                    background-color: white; 
                    -webkit-print-color-adjust: exact !important;
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    box-sizing: border-box;
                }
                .ql-container {
                    background-color: white;
                    min-height: 200px;
                }
                h1, p, ul, ol {
                    color: black !important;
                    display: block;
                }
            </style>
        </head>
        <body>
            <div class="ql-container">
                ${content} 
            </div>
        </body>
    </html>
  `;
try {
    await page.setContent(htmlTemplate, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' } 
    });

    return Buffer.from(pdfBuffer);

  } catch (error) {
    console.error("***** PUPPETEER ERROR:", error);
    throw error;
  } finally {
    await browser.close();
  }
};

export default convertToPDF;