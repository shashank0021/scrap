import axios from 'axios';
import * as cheerio from 'cheerio';
import xl from 'excel4node';


async function getData() {

    const allJobDetails = [];
    const jobTitles = [];
    const companyName = [];
    const postedDate = [];
    const jobDescription = [];

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('allProducts');

    // Define column headings
    const headingColumnNames = ['ID', 'Job Title', ' Comapany Name', 'Posted Date', ' Job Description'];

    // Add column headings to the worksheet
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++).string(heading);
    });


    try {
        const response = await axios.get('https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&searchTextSrc=as&searchTextText=Noida%2F+Greater+Noida&txtKeywords=react+developer&txtLocation=Noida%2F+Greater+Noida&cboWorkExp1=0');

        // console.log(response.data);
        const $ = cheerio.load(response.data);


        // Job titel
        $('h2 a').each((index, element) => {
            const jTitle = $(element).text().trim();
            jobTitles.push(jTitle);
        })

        // Company name
        $('.joblist-comp-name').each((index, element) => {
            const cName = $(element).text().trim();
            companyName.push(cName);
        })

        // Posted Date
        $('.sim-posted').each((index, element) => {
            const pDate = $(element).text().trim();
            postedDate.push(pDate);
        })

        // Job Discription 
        $('ul.list-job-dtl.clearfix li').each((index, element) => {
            let jobDis = $(element).text().trim();
            jobDis = jobDis.replace(/\n/g, ' ').replace(/\s+/g, ' ');
            const jobDescriptionContent = jobDis.replace(/^Job Description:\s*/, '');
            jobDescription.push(jobDescriptionContent)
        })


        for (let i = 0; i < jobTitles.length; i++) {
            const jobDetails = {
                id: i,
                jobTitles: jobTitles[i] || "N/A",
                companyName: companyName[i] || "N/A",
                postedDate: postedDate[i] || 'N/A',
                jobDescription: jobDescription[i] || 'N/A'
            }

            allJobDetails.push(jobDetails)
        }


        console.log(jobTitles);
        console.log(companyName);
        console.log(postedDate);
        console.log(jobDescription);
        console.log(allJobDetails);
    
        let rowIndex = 2; // Start from the second row after the headers
        allJobDetails.forEach(job => {
         ws.cell(rowIndex, 1).number(job.id);
         ws.cell(rowIndex, 2).string(job.jobTitles);
         ws.cell(rowIndex, 3).string(job.companyName);
         ws.cell(rowIndex, 4).string(job.postedDate);
         ws.cell(rowIndex, 5).string(job.jobDescription);
         rowIndex++;
      });


      // Write the workbook to a file
      wb.write('AllJobDetails.xlsx', (err, stats) => {
        if (err) {
           console.error('Error saving the Excel file:', err);
        } else {
           console.log('Excel file saved successfully!');
        }
     });




    }
    catch (err) {
        console.log(err);

    }


}
getData();