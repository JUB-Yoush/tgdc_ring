// taken from https://github.com/JusGu/uwatering
const formatUrl = (url) => {
    return url
        .replace(/^https?:\/\/(www\.)?/, "")
        .replace(/\/$/, "")
        .replace(/^www\./, "");
};
// search for website urls within tolerance of protocol, subdomain and trailing slashes
const fuzzyMatch = (searchTerm, target) => {
    const searchTermFormatted = formatUrl(searchTerm);
    const targetFormatted = formatUrl(target);
    return searchTermFormatted.includes(targetFormatted) || targetFormatted.includes(searchTermFormatted);
};

let navigateWebring = () => {
    const fragment = window.location.hash.slice(1); // #your-site-here?nav=
    if (!fragment.includes("?")) return;

    const [currentSite, query] = fragment.split("?");
    const params = new URLSearchParams(query);
    const nav = params.get("nav");
    const navTrimmed = nav ? nav.replace(/\/+$/, "").trim() : "";
    if (!nav || !["next", "random", "prev"].includes(navTrimmed)) return;

    const match = webringData.sites.filter((site) =>
        fuzzyMatch(currentSite, site.website)
    );
    if (match.length === 0) return;
    if (match.length > 1) {
        throw new Error(
            `Cannot calculate navigation state because mutiple URLs matched ${currentSite}`
        );
    }

    const currIndex = webringData.sites.findIndex((site) =>
        fuzzyMatch(currentSite, site.website)
    );
    const increment = navTrimmed === "next" ? 1 : -1;
    let newIndex = (currIndex + increment) % webringData.sites.length;

    if (navTrimmed == "random") {
        var randomIndex = currIndex;
        while (randomIndex === currIndex) {

            randomIndex = Math.floor(Math.random() * webringData.sites.length);
        }
    }

    if (newIndex < 0) newIndex = webringData.sites.length - 1;
    if (!webringData.sites[newIndex]) return;

    document.body.innerHTML = `
  <main>
    <p>redirecting...</p>
  </main>
  `;
    window.location.href = webringData.sites[newIndex].website;
};

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.hash.includes("?nav=")) {
        debugger;
        navigateWebring();
    }

    populateList()
    window.addEventListener("hashchange", navigateWebring);

});

let populateList = () => {

    webringData["sites"].forEach((siteData, i) => {

        var list = document.getElementById("site_list")

        var li = document.createElement("li");

        var link = document.createElement("a");
        link.href = siteData["website"]
        link.textContent = `<${siteData.name}>`;



        li.appendChild(link);
        if (siteData.rss != "") {
            var rss = document.createElement("a");
            rss.href = siteData["rss"]
            rss.textContent = "{rss}";
            li.appendChild(rss);
        }
        list.appendChild(li);
    });

}