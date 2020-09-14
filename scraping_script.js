let ObjectsToCsv = require('objects-to-csv');
require("chromedriver");
let swd = require("selenium-webdriver");
// build browser
let bldr = new swd.Builder();
let revArr = [];
let count  = 0;

let nextPage = "https://www.amazon.in/Yogabar-Wholegrain-Breakfast-Muesli-Fruits/product-reviews/B07M6KZQCN";
async function fn(){
    let driver = bldr.forBrowser("chrome").build();
    await driver.get(nextPage);
    await driver.manage().setTimeouts({ implicit: 10000 });
    let allRev = await driver.findElements(swd.By.css(".a-section.review.aok-relative"));
    for(let i = 0; i<allRev.length;i++){
        let sId = i + 1;
        let nameP =  await allRev[i].findElement(swd.By.css(`.a-section.celwidget .a-profile-name`)).getText();
        let dateP = await allRev[i].findElement(swd.By.css(`[data-hook="review-date"]`)).getText();
        let starP =  await allRev[i].findElement(swd.By.css(`[data-hook="review-star-rating"]`)).getAttribute("class");
        let commentP = await allRev[i].findElement(swd.By.css(`.a-section.celwidget a[data-hook ="review-title"]`)).getText();
        let detailedRev = await (await allRev[i].findElement(swd.By.css(`[data-hook="review-body"]`))).getText();
        revArr.push({
            id: sId,
            name: nameP, 
            date : dateP,
            rating : starP,
            comment: commentP,
            detailedReview : detailedRev,
        });
    }

    nextPage = await driver.findElement(swd.By.css(`[data-hook="pagination-bar"] ul .a-last a`)).getAttribute("href");
    for(let q = 0; q<49; q++){
        await nextPageHandle(driver, nextPage);
        console.log(count);
        count++;
        console.log("---------------------------------------------------------------------------------")
    }
    console.log(revArr.length)
    console.log(revArr);
    await filesave();
    

}
async function nextPageHandle(driver, link){
    await driver.get(link);
    await driver.manage().setTimeouts({ implicit: 10000 });
    let allRev = await driver.findElements(swd.By.css(".a-section.review.aok-relative"));
    for(let i = 0; i<allRev.length;i++){
        let sId = i + 1;
        let nameP =  await allRev[i].findElement(swd.By.css(`.a-section.celwidget .a-profile-name`)).getText();
        let dateP = await allRev[i].findElement(swd.By.css(`[data-hook="review-date"]`)).getText();
        let starP =  await allRev[i].findElement(swd.By.css(`[data-hook="review-star-rating"]`)).getAttribute("class");
        let commentP = await allRev[i].findElement(swd.By.css(`.a-section.celwidget a[data-hook ="review-title"]`)).getText();
        let detailedRev = await (await allRev[i].findElement(swd.By.css(`[data-hook="review-body"]`))).getText();
        revArr.push({
            id: sId,
            name: nameP, 
            date : dateP,
            rating : starP,
            comment: commentP,
            detailedReview : detailedRev,
        });
    }

    nextPage = await driver.findElement(swd.By.css(`[data-hook="pagination-bar"] ul .a-last a`)).getAttribute("href");
}

async function filesave(){
    let csv = new ObjectsToCsv(revArr);
    await csv.toDisk('./yogabars.csv')
    console.log(await csv.toString());
}

fn();

