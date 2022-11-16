import cheerio from "cheerio";

export type GameObj = {
    title: string;
    appId: string;
    hasPlayed?: boolean;
    playerCount?: number;
}

export const scrapeTopGames = async (gameObjs: GameObj[] = [], pageNum = 1): Promise<GameObj[]> => {
    const response = await fetch(`https://store.steampowered.com/search/?category1=998&filter=topsellers&supportedlang=english&page=${pageNum}`);
    const htmlText = await response.text();
    const $ = cheerio.load(htmlText);
    const gameEls = $(".search_result_row");
    gameEls.each((i, el) => {
        const title = $(el).find('.title').text();
        const appId = $(el).attr('data-ds-appid') || "";
        const release = $(el).find('.search_released').text().trim();
        const now = new Date();
        let date = new Date(release);
        if(now.getTime() > date.getTime())
            gameObjs.push({title, appId});
    })
    
    if(gameObjs.length < 200) {
        return scrapeTopGames(gameObjs, pageNum+1);
    } else {
        return gameObjs;
    }
}

export const getRandomGame = (games: Array<GameObj>) => {
    const rand = Math.floor(Math.random()*games.length);
    return games[rand];
}