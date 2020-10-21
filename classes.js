// HTMLRewriter element handlers
export class LinksTransformer {
    constructor(links) {
      this.links = links
    }
  
    async element(element) {
      this.links.forEach(linkData =>{
        element.append(`<a href='${linkData.link}' target='_blank'>${linkData.name}</a>`, {html:true})
      })
    }
  }
  
  export class UpdateAttribute{
    constructor(attributeName, newValue){
      this.attributeName = attributeName;
      this.newValue = newValue;
    }
  
    async element(element){
      element.setAttribute(this.attributeName, this.newValue);
    }
  
  }
  
  export class UpdateContent{
  
    constructor(newContent){
      this.content = newContent
    }
  
    async element(element){
      element.setInnerContent(this.content)
    }
  }
  
  export class SocialLinksTransformer{
  
    constructor(images){
      this.images = images
    }
  
    async element(element){
      this.images.forEach(dataPair =>{
        element.append(`<a href='${dataPair.link}' target='_blank'> <img src='${dataPair.imgPath}'></img></a>`, {html:true})
      })
    }
  }