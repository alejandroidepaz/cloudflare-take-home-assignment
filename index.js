addEventListener('fetch', event => {

  const links = [{"name":"My Portfolio", "link": "https://alejandrodepaz.com"}, {"name":"BitBucket", "link": "https://bitbucket.org/alejandrodepaz/software-projects"}, {"name":"LinkedIn", "link": "https://www.linkedin.com/in/alejandrodepaz/"}]
  var parsedURL = event.request.url.split("/");
  var urlLength = parsedURL.length

  if (urlLength == 4 && parsedURL[urlLength-1] === 'links'){
    event.respondWith(handleLinksRequest(event.request, links));

  } else{
    event.respondWith(handleGenericRequest("https://static-links-page.signalnerve.workers.dev", links));

  }
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleLinksRequest(request, links) { // Handler for API endpoint /links

  var jsonLinksObj = JSON.stringify(links);

  return new Response(jsonLinksObj, {
    headers: { 'content-type': 'application/json' },
  });
}

async function handleGenericRequest(request, links){ // Handler for all requests that aren't made to the API /links endpoint

  const imgPaths = [{"link":"https://facebook.com", "imgPath":"https://simpleicons.org/icons/facebook.svg"}, {"link":"https://twitter.com", "imgPath":"https://simpleicons.org/icons/twitter.svg"}, {"link":"https://instagram.com", "imgPath":"https://simpleicons.org/icons/instagram.svg"}]
  const res = await fetch(request);
  const rewriter = new HTMLRewriter()
  .on("div#links", new LinksTransformer(links))
  .on("div#profile", new UpdateAttribute("style", "display:flex"))
  .on("img#avatar", new UpdateAttribute("src", "https://media-exp1.licdn.com/dms/image/C5635AQH3uelN1T6DBA/profile-framedphoto-shrink_200_200/0?e=1603152000&v=beta&t=zMvjtl426mPq1oxbfmeIzIz3V13W6YJog-e17pwsM8o"))
  .on("h1#name", new UpdateContent("Alejandro De Paz"))
  .on("title", new UpdateContent("Alejandro De Paz"))
  .on("div#social", new UpdateAttribute("style", "display:flex"))
  .on("div#social", new SocialLinksTransformer(imgPaths))
  .on("body", new UpdateAttribute("class", "bg-blue-500"))

  return rewriter.transform(res, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}


// HTMLRewriter element handlers
class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    this.links.forEach(linkData =>{
      element.append(`<a href='${linkData.link}' target='_blank'>${linkData.name}</a>`, {html:true})
    })
  }
}

class UpdateAttribute{
  constructor(attributeName, newValue){
    this.attributeName = attributeName;
    this.newValue = newValue;
  }

  async element(element){
    element.setAttribute(this.attributeName, this.newValue);
  }

}

class UpdateContent{

  constructor(newContent){
    this.content = newContent
  }

  async element(element){
    element.setInnerContent(this.content)
  }
}

class SocialLinksTransformer{

  constructor(images){
    this.images = images
  }

  async element(element){
    this.images.forEach(dataPair =>{
      element.append(`<a href='${dataPair.link}' target='_blank'> <img src='${dataPair.imgPath}'></img></a>`, {html:true})
    })
  }
}