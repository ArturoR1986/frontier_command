// Preserve live controls across network updates, including focus and pointer targets.
export function patchHTML(element,html) {
  if(element._html===html)return; element._html=html;
  const template=document.createElement('template');template.innerHTML=html;
  function sync(parent,source) {
    for(let i=0;i<source.childNodes.length;i++) {
      const next=source.childNodes[i];let old=parent.childNodes[i];
      if(!old){parent.append(next.cloneNode(true));continue;}
      if(old.nodeType!==next.nodeType||old.nodeName!==next.nodeName){parent.replaceChild(next.cloneNode(true),old);continue;}
      if(old.nodeType===3){if(old.nodeValue!==next.nodeValue)old.nodeValue=next.nodeValue;continue;}
      if(old.nodeType!==1)continue;
      for(const attr of [...old.attributes])if(!next.hasAttribute(attr.name))old.removeAttribute(attr.name);
      for(const attr of next.attributes)if(old.getAttribute(attr.name)!==attr.value)old.setAttribute(attr.name,attr.value);
      sync(old,next);
    }
    while(parent.childNodes.length>source.childNodes.length)parent.lastChild.remove();
  }
  sync(element,template.content);
}
