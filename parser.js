
class Parser{
  createNode(node){
    let newnode = Object.assign({},node.attribs || {});
    this.parseCoordinate(newnode);
    this.parseTags(node,newnode);
    this.parseOthers(node,newnode);
    newnode.id = parseInt(newnode.id);
    return newnode;

  }
  parseCoordinate(newnode){
     var lat = parseFloat(newnode.lat);
     var lng = parseFloat(newnode.lon);
     if(lat && lng){
      newnode.loc={
        type:"Point",
        coordinates:[lng,lat]
      }
      newnode.lat = lat;
      newnode.lng = lng;
      delete newnode.lon;
     }
  }
  parseTags(node,newnode){
    if(node.children && node.children.tag){
      var tags = node.children.tag;
      let tag;
      newnode.tags = {};
      if(Array.isArray(tags)){
        for(var i=0;i<tags.length;i++){
          tag = tags[i];
          //console.log(tag.attribs.k)
          if(tag.attribs && tag.attribs.k){
            if(tag.attribs.k.trim() === "name"){
              newnode.name = tag.attribs.v.trim();
            }
            else{
              newnode.tags[tag.attribs.k.trim()]=tag.attribs.v.trim();
            }
          }
        }
      }
      else if(tags.attribs && tags.attribs.k){
          newnode.tags[tags.attribs.k.trim()]=tags.attribs.v.trim();
      }
    }
    //console.log(newnode)
  }
  parseOthers(node,newnode){
    var childname,child;
    if(!node.children) return;
    for(childname in node.children){
      if(childname !== "tag"){
        child = node.children[childname];
        if(Array.isArray(child)){
          newnode[childname] = []
          child.forEach((child)=>{
            newnode[childname].push(child.attribs);
          })
        }
        else{
          newnode[childname] = child.attribs;
        }
      }
    
    }
  }
}
const nodeParser = new Parser();
exports.nodeParser = nodeParser;

