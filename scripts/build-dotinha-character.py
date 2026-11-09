"""Primeiro estudo 3D da Dotinha. Executar no Blender pelo MCP.

Referência: Figma QjE7zWQhBFwe7OZbHQGOaD, nó 1:1045.
Cria uma cena nova e preserva a cena que já estava aberta.
"""
import bpy
import math
import json
from pathlib import Path
from mathutils import Vector, Quaternion

ROOT = Path(r'C:\Users\Lucas Sampaio\Projetos\midia-kit-vitoria')
OUT = ROOT / 'art/character'
OUT.mkdir(parents=True, exist_ok=True)
if bpy.data.scenes.get('Dotinha | Estudo 01'):
    raise RuntimeError('A cena do estudo já existe. Evitando duplicar o personagem.')
scene = bpy.data.scenes.new('Dotinha | Estudo 01')
bpy.context.window.scene = scene
character = bpy.data.collections.new('Dotinha | Personagem')
studio = bpy.data.collections.new('Dotinha | Estúdio')
scene.collection.children.link(character)
scene.collection.children.link(studio)

def linear(v):
    return v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4

def material(name, color, rough=.65):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    rgba = tuple(linear(int(color[i:i+2], 16) / 255) for i in (0, 2, 4)) + (1,)
    m.diffuse_color = rgba
    shader = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    shader.inputs['Base Color'].default_value = rgba
    shader.inputs['Roughness'].default_value = rough
    return m

mats = [
    material('Pelo | Pêssego', 'EECBA4'),
    material('Orelhas | Caramelo', 'D89A5C'),
    material('Pelo | Luz', 'F4D8B4'),
    material('Olhos | Creme', 'FFFFEB', .35),
    material('Olhos e sorriso | Marrom', '633B22', .38),
    material('Nariz | Café escuro', '302016', .3),
    material('Brilho | Creme', 'FFFFF8', .2),
    material('Detalhes | Caramelo suave', 'BE8A58'),
]
verts, faces, indices, weights = [], [], [], []

def add_mesh(vs, fs, mat, bone):
    offset = len(verts)
    verts.extend(vs)
    faces.extend(tuple(offset+i for i in f) for f in fs)
    indices.extend([mat] * len(fs))
    for v in vs:
        if bone == 'body':
            blend = max(0, min(1, (v[2] - .75) / .65))
            weights.append({'hips': 1-blend, 'spine': blend})
        else:
            weights.append({bone: 1.0})

def ellipsoid(name, center, size, mat=0, bone='head', segments=24, rings=14, tilt=0):
    vs, fs = [], []
    co, si = math.cos(tilt), math.sin(tilt)
    for j in range(rings+1):
        lat = math.pi * j / rings
        for i in range(segments):
            lon = math.tau * i / segments
            x = size[0] * math.sin(lat) * math.cos(lon)
            y = size[1] * math.sin(lat) * math.sin(lon)
            z = size[2] * math.cos(lat)
            vs.append((center[0]+co*x+si*z, center[1]+y, center[2]-si*x+co*z))
    for j in range(rings):
        for i in range(segments):
            a=j*segments+i; b=j*segments+(i+1)%segments
            if j == 0:
                fs.append((a,b+segments,a+segments))
            elif j == rings-1:
                fs.append((a,b,a+segments))
            else:
                fs.append((a,b,b+segments,a+segments))
    add_mesh(vs,[tuple(reversed(f)) for f in fs],mat,bone)

def lock(base, tip, width, depth, mat=0, bone='head', bend=(0,0,0)):
    start, end = Vector(base), Vector(tip)
    direction = (end-start).normalized()
    across = direction.cross(Vector((0,1,0)))
    if across.length < .01:
        across = direction.cross(Vector((1,0,0)))
    across.normalize()
    other = direction.cross(across).normalized()
    vs,fs=[],[]
    profiles = [.65,.95,1,.8,.43,.04]
    n=12
    for j,p in enumerate(profiles):
        t=j/(len(profiles)-1)
        mid=start.lerp(end,t)+Vector(bend)*math.sin(math.pi*t)
        for i in range(n):
            a=math.tau*i/n
            vs.append(tuple(mid+across*math.cos(a)*width*p+other*math.sin(a)*depth*p))
    for j in range(len(profiles)-1):
        for i in range(n):
            a=j*n+i;b=j*n+(i+1)%n
            fs.append((a,b,b+n,a+n))
    fs.extend([tuple(reversed(range(n))),tuple((len(profiles)-1)*n+i for i in range(n))])
    add_mesh(vs,fs,mat,bone)

def line(points, radius=.017, mat=4, bone='head', sides=8):
    vs,fs=[],[]
    for j,p in enumerate(points):
        p=Vector(p)
        d=Vector(points[min(j+1,len(points)-1)])-Vector(points[max(0,j-1)])
        d.normalize()
        across=d.cross(Vector((0,1,0))).normalized()
        other=d.cross(across).normalized()
        for i in range(sides):
            a=math.tau*i/sides
            vs.append(tuple(p+radius*(math.cos(a)*across+math.sin(a)*other)))
    for j in range(len(points)-1):
        for i in range(sides):
            a=j*sides+i;b=j*sides+(i+1)%sides
            fs.append((a,b,b+sides,a+sides))
    fs.extend([tuple(reversed(range(sides))),tuple((len(points)-1)*sides+i for i in range(sides))])
    add_mesh(vs,fs,mat,bone)

# Corpo compacto com peito e barriga claros.
ellipsoid('Corpo', (0,.035,1.01), (.49,.36,.65), bone='body',segments=32,rings=20)

for s,side in [(-1,'R'),(1,'L')]:
    leg='leg.'+side; arm='arm.'+side; ear='ear.'+side
    ellipsoid('Perna', (s*.235,.015,.39),(.185,.22,.31),bone=leg)
    ellipsoid('Pata', (s*.245,-.12,.145),(.235,.31,.145),bone=leg)
    for x in [-.075,.07]:
        line([(s*.245+x,-.405,.105),(s*.245+x,-.422,.15),(s*.245+x,-.40,.20)],.009,7,leg)
    ellipsoid('Braço', (s*.49,.025,1.12),(.195,.235,.38),bone=arm,tilt=-s*.14)
    ellipsoid('Mão', (s*.555,-.035,.825),(.205,.24,.23),bone=arm)
    ellipsoid('Polegar', (s*.43,-.205,.87),(.09,.10,.15),bone=arm,segments=16,rings=10,tilt=s*.3)
    for z,reach in [(1.36,.66),(1.15,.7),(.98,.72)]:
        lock((s*.44,.04,z+.13),(s*reach,.04,z-.18),.11,.14,0,arm)
    for z,reach in [(.66,.42),(.47,.44)]:
        lock((s*.29,.04,z+.1),(s*reach,.04,z-.18),.085,.12,0,leg)

# Cabeça larga, orelhas caídas e mechas com a silhueta da identidade.
ellipsoid('Cabeça', (0,-.015,2.055),(.65,.455,.63),0,'head',40,24)
ellipsoid('Bochechas', (0,-.19,1.89),(.61,.35,.36),0,'head',32,18)
for s,side in [(-1,'R'),(1,'L')]:
    ear='ear.'+side
    ellipsoid('Orelha', (s*.585,-.005,2.25),(.255,.235,.40),1,ear,28,18,tilt=-s*.20)
    for j in range(3):
        lock((s*(.58+j*.045),-.015,2.31-j*.08),(s*(.79+j*.025),-.015,2.11-j*.08),.10,.16,1,ear)
    for j in range(2):
        lock((s*(.49-j*.03),.015,1.98-j*.18),(s*(.70-j*.05),-.02,1.78-j*.16),.14,.17,0,'head')
    # Olhos verticais com pupila castanha e dois pontos de luz.
    ellipsoid('Branco', (s*.248,-.423,2.115),(.13,.074,.18),3,'head',28,16)
    ellipsoid('Pupila', (s*.248+.014,-.485,2.10),(.077,.037,.132),4,'head',24,16)
    ellipsoid('Brilho', (s*.248-.012,-.519,2.151),(.026,.012,.035),6,'head',12,8)
    ellipsoid('Brilho pequeno', (s*.248+.037,-.52,2.05),(.011,.009,.014),6,'head',12,8)
    ellipsoid('Sobrancelha', (s*.25,-.382,2.38),(.14,.045,.048),1,'head',20,10,tilt=s*.20)

for b,t,w,d in [((-.30,.0,2.48),(-.48,-.02,2.65),.13,.18),((-.12,-.01,2.51),(-.30,-.03,2.74),.15,.17),((.08,.005,2.52),(-.12,-.01,2.79),.15,.16),((.22,.035,2.51),(.21,.02,2.68),.10,.14)]:
    lock(b,t,w,d,0,'head',bend=(-.025,-.05,0))

# Focinho curto, nariz achatado e sorriso duplo.
ellipsoid('Focinho esquerdo',(-.115,-.421,1.892),(.225,.165,.172),2)
ellipsoid('Focinho direito',(.115,-.421,1.892),(.225,.165,.172),2)
ellipsoid('Nariz',(0,-.575,1.999),(.153,.092,.105),5,segments=28,rings=16)
ellipsoid('Brilho nariz',(-.042,-.654,2.035),(.048,.011,.014),7,segments=16,rings=8)
line([(0,-.592,1.947),(0,-.601,1.90),(0,-.598,1.848)],.018)
for s in [-1,1]:
    points=[]
    for i in range(13):
        t=i/12
        points.append((s*.21*t,-.58+.065*t*t,1.848-.045*math.sin(math.pi*t)+.022*t))
    line(points,.018)

# Cauda curta, visível também no perfil.
lock((0,.23,.73),(.16,.68,1.10),.15,.14,0,'tail',bend=(.05,.08,.03))
lock((.10,.57,.98),(.05,.74,1.24),.12,.10,2,'tail',bend=(.07,.03,0))

mesh=bpy.data.meshes.new('Dotinha | Malha do estudo')
mesh.from_pydata(verts,[],faces)
mesh.update()
dog=bpy.data.objects.new('Dotinha',mesh)
character.objects.link(dog)
for m in mats: mesh.materials.append(m)
for p,idx in zip(mesh.polygons,indices):
    p.material_index=idx;p.use_smooth=True

# Esqueleto simples, editável e compatível com exportação para a web.
adata=bpy.data.armatures.new('Dotinha | Esqueleto')
rig=bpy.data.objects.new('Dotinha_Rig',adata)
character.objects.link(rig)
bpy.context.view_layer.objects.active=rig
rig.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bones=[('root',(0,0,0),(0,0,.25),None),('hips',(0,0,.64),(0,0,1.0),'root'),('spine',(0,0,1.0),(0,0,1.53),'hips'),('head',(0,0,1.53),(0,0,2.38),'spine'),('tail',(0,.25,.74),(0,.6,1.03),'hips')]
for s,side in [(-1,'R'),(1,'L')]:
    bones += [('leg.'+side,(s*.235,0,.65),(s*.235,0,.18),'hips'),('arm.'+side,(s*.45,0,1.39),(s*.56,0,.8),'spine'),('ear.'+side,(s*.5,0,2.51),(s*.65,0,2.13),'head')]
for name,head,tail,parent in bones:
    b=adata.edit_bones.new(name);b.head=head;b.tail=tail
    if parent: b.parent=adata.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
rig.show_in_front=True
for name, *_ in bones:
    vg=dog.vertex_groups.new(name=name)
    for i,w in enumerate(weights):
        if w.get(name,0)>.00001: vg.add([i],w[name],'REPLACE')
mod=dog.modifiers.new('Dotinha | Deformação','ARMATURE');mod.object=rig
dog.parent=rig
for pb in rig.pose.bones: pb.rotation_mode='XYZ'

# Três clipes. A caminhada é no lugar; o site controlará o deslocamento.
rig.animation_data_create()
clips=[]
def reset_pose():
    for pb in rig.pose.bones:
        pb.location=(0,0,0);pb.rotation_euler=(0,0,0);pb.scale=(1,1,1)

for name,length in [('Idle',72),('Walk',24),('Jump',40)]:
    action=bpy.data.actions.new('Dotinha_'+name)
    action.use_fake_user=True
    rig.animation_data.action=action
    for f in range(1,length+2):
        reset_pose();t=(f-1)/length;p=math.tau*t
        pb=rig.pose.bones
        if name=='Idle':
            pb['spine'].scale.y=1+.012*math.sin(p)
            pb['head'].rotation_euler.y=.035*math.sin(p)
            pb['tail'].rotation_euler.y=.15*math.sin(p*3)
            pb['ear.L'].rotation_euler.x=.035*math.sin(p+.4)
            pb['ear.R'].rotation_euler.x=.035*math.sin(p-.4)
        elif name=='Walk':
            pb['root'].location.y=.025*(1-math.cos(2*p))
            pb['hips'].rotation_euler.z=.035*math.sin(p)
            pb['head'].rotation_euler.z=-.025*math.sin(p)
            for side,phase in [('L',0),('R',math.pi)]:
                pb['leg.'+side].rotation_euler.x=.40*math.sin(p+phase)
                pb['arm.'+side].rotation_euler.x=-.32*math.sin(p+phase)
                pb['ear.'+side].rotation_euler.x=.075*math.sin(p+phase+.8)
            pb['tail'].rotation_euler.y=.22*math.sin(p)
        else:
            # Antecipação, subida, queda e recuperação.
            if t<.2: height=-.10*math.sin(math.pi*t/.4);spread=-.10*math.sin(math.pi*t/.4)
            elif t<.8: height=.62*math.sin(math.pi*(t-.2)/.6);spread=.48*math.sin(math.pi*(t-.2)/.6)
            else: height=-.07*math.sin(math.pi*(t-.8)/.2);spread=0
            pb['root'].location.y=height
            pb['arm.L'].rotation_euler.z=spread
            pb['arm.R'].rotation_euler.z=-spread
            pb['leg.L'].rotation_euler.x=-.15*max(0,math.sin(math.pi*t))
            pb['leg.R'].rotation_euler.x=.15*max(0,math.sin(math.pi*t))
            pb['ear.L'].rotation_euler.x=.15*math.sin(p)
            pb['ear.R'].rotation_euler.x=.15*math.sin(p)
        for b in pb:
            b.keyframe_insert('location',frame=f,group=b.name)
            b.keyframe_insert('rotation_euler',frame=f,group=b.name)
            b.keyframe_insert('scale',frame=f,group=b.name)
    track=rig.animation_data.nla_tracks.new();track.name=name
    strip=track.strips.new(action.name,1,action);track.mute=True
    clips.append({'name':action.name,'frames':length,'fps':24})
rig.animation_data.action=bpy.data.actions['Dotinha_Idle']
scene.render.fps=24;scene.frame_start=1;scene.frame_end=72;scene.frame_set(1)

# Estúdio separado do personagem, sem entrar na exportação GLB.
floor_mat=material('Estúdio | Creme','FFFFEB',.85)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.012))
floor=bpy.context.object;floor.name='Estúdio | Fundo'
for c in list(floor.users_collection):c.objects.unlink(floor)
studio.objects.link(floor);floor.data.materials.append(floor_mat)

def aim(obj,at):obj.rotation_euler=(Vector(at)-obj.location).to_track_quat('-Z','Y').to_euler()
def area(name,pos,power,size,color):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;data.color=color
    obj=bpy.data.objects.new(name,data);studio.objects.link(obj);obj.location=pos;aim(obj,(0,0,1.3))
area('Estúdio | Luz principal',(-3.5,-4.5,6),500,4,(1,.88,.73))
area('Estúdio | Preenchimento',(4,-2.5,3.5),300,3,(.84,.90,1))
area('Estúdio | Contorno',(1.5,3.5,4.5),650,3,(1,.86,.66))
world=bpy.data.worlds.new('Dotinha | Ambiente');world.use_nodes=True
next(n for n in world.node_tree.nodes if n.type=='BACKGROUND').inputs['Color'].default_value=(.36,.36,.32,1)
next(n for n in world.node_tree.nodes if n.type=='BACKGROUND').inputs['Strength'].default_value=.4
scene.world=world
camdata=bpy.data.cameras.new('Dotinha | Câmera')
camera=bpy.data.objects.new('Dotinha | Câmera',camdata);studio.objects.link(camera)
camera.location=(3.4,-7,3.1);aim(camera,(0,0,1.4));camdata.type='ORTHO';camdata.ortho_scale=3.65
scene.camera=camera
scene.render.resolution_x=1100;scene.render.resolution_y=1100;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.filepath=str(OUT/'dotinha-study-01.png')
try:scene.render.engine='CYCLES'
except TypeError:pass
if hasattr(scene,'cycles'):scene.cycles.samples=48;scene.cycles.use_denoising=True
scene.view_settings.view_transform='AgX'
scene.view_settings.look='None'
scene['referencia']='Figma | Identidade | 1:1045 | consultado em 07/11/2026'
scene['estado']='Estudo 01. Modelo e animações para avaliação; ainda sem integração ao site.'
rig['clips']='Dotinha_Idle, Dotinha_Walk, Dotinha_Jump'
rig['orientacao']='Frente: -Y no Blender. Altura aproximada: 2.84 unidades. Caminhada no lugar.'

bpy.ops.object.select_all(action='DESELECT')
dog.select_set(True);rig.select_set(True);bpy.context.view_layer.objects.active=rig
for screen in bpy.data.screens:
    for a in screen.areas:
        if a.type=='VIEW_3D':
            a.spaces.active.region_3d.view_distance=4.6
            a.spaces.active.region_3d.view_location=(0,0,1.4)
            a.spaces.active.region_3d.view_rotation=camera.rotation_euler.to_quaternion()
            a.spaces.active.shading.type='MATERIAL'
            a.spaces.active.overlay.show_overlays=False
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'dotinha-study-01.blend'))
(OUT/'manifest.json').write_text(json.dumps({'reference_node':'1:1045','stage':'Estudo 01','vertices':len(verts),'triangles':sum(len(f)-2 for f in faces),'bones':len(bones),'clips':clips},indent=2),encoding='utf-8')
print(json.dumps({'saved':str(OUT/'dotinha-study-01.blend'),'vertices':len(verts),'triangles':sum(len(f)-2 for f in faces),'bones':len(bones),'clips':clips}))
