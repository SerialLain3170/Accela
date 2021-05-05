import superagent from "superagent"
import cheerio from "cheerio"
import express from "express"

const app: express.Express = express()
const port = process.env.PORT
const maxD: number = 2
const artists: Array<string | undefined> = [
    "/templime",
    "/harito",
    "/ujico",
    "/sakuzyo",
    "/hamu_lr",
    "/mamomop",
    "/psyqui",
    "/ntreboot",
    "/lemon-t-1",
    "/capchii"
]
var hashmap: {[key: string]: boolean} = {}

function serve() {
    app.set("view engine", "ejs")
    app.set("views", "./templates")
    app.use("/static", express.static("./static"))
    app.get("/", controller)
    app.listen(port, () => console.log("Listening"))
}

async function assembleLinks(artists: Array<string | undefined>, depth: number, maxDepth: number): Promise<Array<string | undefined>> {
    var links: Array<string | undefined> = []

    if (depth == maxDepth) {
        return links
    }

    for (var artist of artists) {
        // check duplicate in links
        if (artist !== undefined) {
            if (hashmap[artist]) {
                continue
            } else {
                hashmap[artist] = true
            }
        }

        var nextArtists: Array<string | undefined> = []
        var url: string = "https://soundcloud.com" + artist + "/likes"
        console.log(url)
        const result = await superagent.get(url)
        const $ = cheerio.load(result.text)
        const articlesItems = $("noscript")
        const nonscript = cheerio.load(articlesItems.text())
        nonscript("article").find("a").each((index, value) => {
            if (index > 0) {
                var link: string | undefined = nonscript(value).attr("href")
                if (nonscript(value).attr("itemprop") == "url") {
                    var playerLink = "https://w.soundcloud.com/player/?url=http://soundcloud.com" + link + "&color=%232d2acf&buying=false&sharing=false&download=false"
                    links.push(playerLink)
                } else {
                    var artist = nonscript(value).attr("href")
                    nextArtists.push(artist)
                }
            }
        })
        var nextLinks = await assembleLinks(nextArtists, depth + 1, maxDepth)
        links.concat(nextLinks)
    }

    return links
}

async function controller(req: express.Request, res: express.Response, next: express.NextFunction) {
    var links = await assembleLinks(artists, 0, maxD)
    links = arrayShuffle(links).slice(0, 50)
    let data = {
        "title": "Accela",
        "array": links
    }
    res.render("index.ejs", data)
}

function arrayShuffle(array: Array<string | undefined>): Array<string | undefined> {
    for(var i: number = (array.length - 1); 0 < i; i--) {
        var r = Math.floor(Math.random() * (i + 1))

        var tmp = array[i]
        array[i] = array[r]
        array[r] = tmp
    }

    return array
}

serve()
