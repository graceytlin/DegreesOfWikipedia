import puppeteer from "puppeteer";

const URL = "https://en.wikipedia.org/wiki/Barack_Obama";

const canadaURL = "https://en.wikipedia.org/wiki/Canada";

async function wikidistance() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL);

    let allLinks = await getLinks(page);

    const foundLinks = allLinks.find((link) => {
        return link.linkHref === canadaURL;
    });

    const nextLinks = [];
    const linkDistance = 0;

    if (foundLinks > 0) {
        linkDistance += 1;
        return;
    } else {
        nextLinks = await getNextLinks(browser, foundLinks);
        const newFoundLinks = nextLinks.find((link) => {
            return link.linkHref === canadaURL;
        });

        if (newFoundLinks > 0) {
            linkDistance += 1;
            return;
        } else {
            return;
        }
    }

    console.log(linkDistance);

    await browser.close();
}

async function getLinks(page) {
    return await page.evaluate(() => {
        const links = document.querySelectorAll('a');

        return Array.from(links).map((link) => {
            const element = link;
            const linkText = element.innerText;
            const linkHref = element.href;

            return { linkText, linkHref }
        });
    }
    )
}

async function getNextLinks(browser, allLinks) {
    const nextLinks = [];

    console.log(allLinks);

    await Promise.all(allLinks.map(async (link) => {
        const nextPage = await browser.newPage();

        await nextPage.goto(link['linkHref']);

        const linkList = await getLinks(nextPage);

        await nextPage.close();

        nextLinks.push(linkList);
    }))

    return nextLinks;
}
wikidistance();