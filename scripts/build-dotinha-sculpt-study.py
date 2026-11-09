"""Estudo 02: aparência primeiro, sem articulações aparentes.

Preserva o estudo 01. Esta versão é uma escultura estática para avaliação.
"""
import bpy
import math
from mathutils import Vector
from pathlib import Path

ROOT=Path(r'C:\Users\Lucas Sampaio\Projetos\midia-kit-vitoria')
OUT=ROOT/'art/character'
if bpy.data.scenes.get('Dotinha | Estudo 02'):
    raise RuntimeError('O estudo 02 já está aberto.')
previous=bpy.data.scenes['Dotinha | Estudo 01']
scene=bpy.data.scenes.new('Dotinha | Estudo 02')
bpy.context.window.scene=scene
collection=bpy.data.collections.new('Dotinha | Escultura 02')
scene.collection.children.link(collection)
scene.collection.children.link(bpy.data.collections['Dotinha | Estúdio'])
scene.camera=previous.camera;scene.world=previous.world
scene.render.engine=previous.render.engine
scene.render.resolution_x=1000;scene.render.resolution_y=1000
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.filepath=str(OUT/'dotinha-study-02.png')
scene.cycles.samples=40;scene.cycles.use_denoising=True
scene.view_settings.view_transform='AgX';scene.view_settings.look='None'
src=(ROOT/'scripts/build-dotinha-character.py').read_text(encoding='utf-8')
exec(src[src.index('verts, faces, indices, weights ='):src.index('# Corpo compacto')])
materials=[bpy.data.materials[n] for n in ['Pelo | Pêssego','Orelhas | Caramelo','Pelo | Luz','Olhos | Creme','Olhos e sorriso | Marrom','Nariz | Café escuro','Brilho | Creme','Detalhes | Caramelo suave']]

def finish(name,mat=0,sculpt=False):
    global verts,faces,indices,weights
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(verts,[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);collection.objects.link(obj)
    mesh.materials.append(materials[mat])
    for p in mesh.polygons:p.use_smooth=True
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True);bpy.context.view_layer.objects.active=obj
    if sculpt:
        remesh=obj.modifiers.new('Unir volumes','REMESH')
        remesh.mode='VOXEL';remesh.voxel_size=.018;remesh.use_smooth_shade=True
        bpy.ops.object.modifier_apply(modifier=remesh.name)
        smooth=obj.modifiers.new('Suavizar transições','SMOOTH');smooth.factor=1.0;smooth.iterations=8
        bpy.ops.object.modifier_apply(modifier=smooth.name)
        sub=obj.modifiers.new('Acabamento','SUBSURF');sub.levels=1;sub.render_levels=1
    verts,faces,indices,weights=[],[],[],[]
    return obj

# Um só volume contínuo para corpo, braços, mãos, pernas e cabeça.
ellipsoid('Corpo',(0,.045,1.00),(.52,.345,.65),segments=32,rings=22)
ellipsoid('Ombros',(0,.025,1.39),(.49,.31,.27),segments=28,rings=18)
ellipsoid('Pescoço',(0,.005,1.62),(.34,.29,.25))
ellipsoid('Cabeça',(0,-.015,2.15),(.66,.455,.61),segments=40,rings=28)
ellipsoid('Face',(0,-.11,1.97),(.60,.39,.34),segments=32,rings=22)
ellipsoid('Focinho integrado',(0,-.398,1.99),(.365,.145,.235),segments=32,rings=20)

for s in [-1,1]:
    ellipsoid('Braço',(s*.60,.045,1.20),(.17,.205,.36),tilt=-s*.25)
    ellipsoid('Mão',(s*.70,-.005,.91),(.18,.20,.245),tilt=-s*.12)
    ellipsoid('Polegar',(s*.61,-.16,.96),(.09,.10,.14),segments=20,rings=12)
    ellipsoid('Perna',(s*.225,.055,.42),(.20,.24,.31))
    ellipsoid('Pé',(s*.235,-.105,.175),(.255,.295,.175),segments=28,rings=18)
    # Mechas baixas, incorporadas à pele, sem cones separados.
    for x,z,angle in [(.575,1.96,-.7),(.56,1.78,-.75),(.48,1.58,-.8)]:
        ellipsoid('Mecha lateral',(s*x,.025,z),(.105,.16,.175),tilt=s*angle,segments=20,rings=14)
    ellipsoid('Mecha ombro',(s*.47,.055,1.43),(.15,.18,.16),tilt=-s*.6)
    ellipsoid('Mecha quadril',(s*.40,.045,.67),(.12,.18,.19),tilt=-s*.4)

# Topete baixo e varrido para o lado, em vez de pontas verticais.
ellipsoid('Topete 1',(-.27,-.005,2.65),(.24,.24,.13),tilt=-.25)
ellipsoid('Topete 2',(-.08,.005,2.71),(.22,.23,.12),tilt=-.4)
ellipsoid('Topete 3',(.10,.025,2.73),(.16,.19,.10),tilt=-.5)
body=finish('Dotinha 02 | Escultura contínua',0,True)

# Orelhas descem sobre as laterais da cabeça, com pequenas assimetrias.
for s in [-1,1]:
    zoff=.025 if s<0 else -.015
    ellipsoid('Raiz orelha',(s*.51,.01,2.52+zoff),(.19,.18,.19),tilt=s*.25)
    ellipsoid('Orelha caída',(s*.655,-.015,2.33+zoff),(.235,.19,.31),tilt=-s*.18,segments=32,rings=22)
    ellipsoid('Ponta orelha',(s*.69,-.025,2.17+zoff),(.18,.165,.16),segments=28,rings=18)
    finish('Dotinha 02 | Orelha '+str(s),1,True)

# Olhos mais planos e focinho discreto, próximos da linguagem da ilustração.
for s in [-1,1]:
    ellipsoid('Branco',(s*.235,-.439,2.245),(.105,.048,.157),segments=32,rings=20)
    finish('Dotinha 02 | Branco '+str(s),3)
    ellipsoid('Olho',(s*.235+.014,-.482,2.23),(.067,.020,.118),segments=28,rings=18)
    finish('Dotinha 02 | Olho '+str(s),4)
    ellipsoid('Reflexo',(s*.235+.031,-.502,2.275),(.021,.007,.027),segments=16,rings=10)
    finish('Dotinha 02 | Reflexo '+str(s),6)
    ellipsoid('Sobrancelha',(s*.235,-.370,2.456),(.13,.032,.039),tilt=s*.24,segments=24,rings=14)
    finish('Dotinha 02 | Sobrancelha '+str(s),1)

ellipsoid('Nariz',(0,-.565,2.085),(.121,.064,.078),segments=32,rings=20)
for i,v in enumerate(verts):
    x,y,z=v
    factor=.65+.35*max(0,min(1,(z-2.007)/.156))
    verts[i]=(x*factor,y,z)
finish('Dotinha 02 | Nariz',5)
line([(0,-.569,2.028),(0,-.576,1.99),(.012,-.57,1.951)],.012)
finish('Dotinha 02 | Centro do sorriso',4)
for s in [-1,1]:
    pts=[]
    for i in range(21):
        t=i/20
        pts.append((s*.225*t,-.57+.045*t*t,1.951-.037*math.sin(math.pi*t)+.032*t))
    line(pts,.012,sides=10)
    finish('Dotinha 02 | Sorriso '+str(s),4)

# Sem sulcos escuros nas patas. O volume sugere os dedos suavemente.
for s in [-1,1]:
    for x in [-.065,.065]:
        ellipsoid('Dedo',(s*.235+x,-.322,.147),(.075,.055,.10),segments=20,rings=14)
    # Mantém volumes do mesmo tom para o estudo de superfície.
    finish('Dotinha 02 | Dedos '+str(s),0,True)

scene['estado']='Estudo 02 estático. Revisão da aparência após feedback; sem rig e sem exportação para o site.'
scene['referencia']='Figma | Identidade | nó 1:1045'
scene.frame_set(1)
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True);bpy.context.view_layer.objects.active=body
for screen in bpy.data.screens:
    for a in screen.areas:
        if a.type=='VIEW_3D':
            a.spaces.active.region_3d.view_location=(0,0,1.4)
            a.spaces.active.region_3d.view_distance=4.6
            a.spaces.active.region_3d.view_rotation=scene.camera.rotation_euler.to_quaternion()
            a.spaces.active.shading.type='MATERIAL'
            a.spaces.active.overlay.show_overlays=False
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'dotinha-study-02.blend'))
bpy.ops.render.render(write_still=True)
print('Estudo 02 salvo e renderizado. A versão anterior foi preservada em outra cena e arquivo.')
