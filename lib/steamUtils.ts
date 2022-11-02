import playwright from "playwright";

export type GameObj = {
    title: string;
    appId: string;
}

export const scrapeTopGames = async () => {
    const browser = await playwright.chromium.launch();

    const page = await browser.newPage();
    await page.goto("https://store.steampowered.com/search/?filter=topsellers&os=win");

    for(let i=0; i<10; i++) {
        await page.mouse.wheel(0, 2000);
        await page.waitForTimeout(500);
    }

    await page.waitForSelector('#search_resultsRows');

    let games = await page.$eval("#search_resultsRows", (list) => {
      let games = []
        for(let i =0; i < list.children.length; i++) {
            let game = {title: "NA", appId: "NA"};
            const gameId = list.children[i].getAttribute("data-ds-appid");
            const gameTitle = list.children[i].querySelector(".title")?.innerHTML;
            if(gameId) game.appId = gameId;
            if(gameTitle) game.title = gameTitle;
            games.push(game)
        }
        return games;
    })
    await browser.close();
    return games;
}

export const getTopGames = async () => {
    const games = await fetch('/api/topSteamGames');
    console.log(games);
    return games;
}