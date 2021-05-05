import superagent from "superagent"
import cheerio from "cheerio"
import express from "express"

const app: express.Express = express()
const port = process.env.PORT

function serve() {
    app.set("view engine", "ejs")
    app.set("views", "./templates")
    app.use("/static", express.static("./static"))
    app.get("/", controller)
    app.listen(port, () => console.log("Listening"))
}

async function parser(url: string): Promise<Array<string | undefined>> {
    const result = await superagent.get(url)
    const $ = cheerio.load(result.text)
    const articlesItems = $("noscript")
    const nonscript = cheerio.load(articlesItems.text())

    var links: Array<string | undefined> = []
    nonscript("article").find("a").each((index, value) => {
        if (index > 0) {
            var link: string | undefined = nonscript(value).attr("href")
            if (nonscript(value).attr("itemprop") == "url") {
                var playerLink = "https://w.soundcloud.com/player/?url=http://soundcloud.com" + link + "&color=%232d2acf&buying=false&sharing=false&download=false"
                links.push(playerLink)
            }
        }
    })

    return links
}

async function convertLinks(): Promise<Array<string | undefined>> {
    const url: string = "https://soundcloud.com/templime/likes"
    const links = parser(url)

    return links
}

async function controller(req: express.Request, res: express.Response, next: express.NextFunction) {
    const links = await convertLinks()
    let data = {
        "title": "Accela",
        "array": links
    }
    res.render("index.ejs", data)
}

serve()
