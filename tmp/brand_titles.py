
import json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
font=TTFont(r"C:/Users/Lucas Sampaio/AppData/Local/Microsoft/Windows/Fonts/raytonbrink-regular.ttf")
gs=font.getGlyphSet(); cmap=font.getBestCmap(); up=font["head"].unitsPerEm
specs={"cover":("Vitória Dota",108),"audience":("Quem me acompanha",72),"performance":("Conteúdo que encontra pessoas",68),"content":("Um pouco do meu universo",72),"contact":("Vamos criar juntos?",88)}
out={}
for key,(word,size) in specs.items():
    scale=size/up; x=0; paths=[]
    for char in word:
        name=cmap.get(ord(char),"space")
        pen=SVGPathPen(gs); gs[name].draw(TransformPen(pen,(scale,0,0,-scale,x,size)))
        paths.append('<path d="'+pen.getCommands()+'"/>')
        x+=gs[name].width*scale
    out[key]='<svg xmlns="http://www.w3.org/2000/svg" width="'+str(x)+'" height="'+str(size*1.3)+'" viewBox="0 0 '+str(x)+' '+str(size*1.3)+'" fill="#633B22">'+''.join(paths)+'</svg>'
print(json.dumps(out,ensure_ascii=True))

