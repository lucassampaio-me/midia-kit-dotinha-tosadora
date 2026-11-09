import { mkdir, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const destination=path.join(base,'public','assets');
await mkdir(destination,{recursive:true});
const queue=[
  {
    "url": "https://www.figma.com/api/mcp/asset/82603d29-2688-4095-a270-5c490838259b.png",
    "name": "82603d29-2688-4095-a270-5c490838259b.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/baeaa879-1fff-4bab-8dde-0cf6fddde7df.png",
    "name": "baeaa879-1fff-4bab-8dde-0cf6fddde7df.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/c540981a-8c88-46ea-8c3d-577d7a1545be.png",
    "name": "c540981a-8c88-46ea-8c3d-577d7a1545be.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/acb3068c-d456-4d5b-b6fc-6de052dd06b7.svg",
    "name": "acb3068c-d456-4d5b-b6fc-6de052dd06b7.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/d8ee6b72-15a1-4969-848a-d0de775a1925.svg",
    "name": "d8ee6b72-15a1-4969-848a-d0de775a1925.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/5b83ff52-311e-4f7d-a82a-3291bdf30bf4.svg",
    "name": "5b83ff52-311e-4f7d-a82a-3291bdf30bf4.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/dfbf285d-e28c-4d93-aa1a-1c4fb0e53908.svg",
    "name": "dfbf285d-e28c-4d93-aa1a-1c4fb0e53908.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/f3062f0d-16d9-4289-b818-d05f2c472669.svg",
    "name": "f3062f0d-16d9-4289-b818-d05f2c472669.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/5c5dde60-39eb-4477-a6fb-6154278a7ac0.svg",
    "name": "5c5dde60-39eb-4477-a6fb-6154278a7ac0.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/b19b3294-aff8-4e18-ae29-f4baea4f8464.svg",
    "name": "b19b3294-aff8-4e18-ae29-f4baea4f8464.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/df34c70d-cce9-46cc-ac55-414b33f8c4e5.svg",
    "name": "df34c70d-cce9-46cc-ac55-414b33f8c4e5.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/cd092678-2f3f-44c6-a4fb-4fefda4ece98.svg",
    "name": "cd092678-2f3f-44c6-a4fb-4fefda4ece98.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/ce7b83d9-2f45-4961-9217-6d1eaa9c7dd9.svg",
    "name": "ce7b83d9-2f45-4961-9217-6d1eaa9c7dd9.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/0748c70d-39d7-4d60-8985-262664fc5e00.svg",
    "name": "0748c70d-39d7-4d60-8985-262664fc5e00.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/460f4084-1c0e-4623-ac46-97e4dfeaae1a.svg",
    "name": "460f4084-1c0e-4623-ac46-97e4dfeaae1a.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/5ba11ee2-8f41-49d8-8a35-1b8d0a3bb788.svg",
    "name": "5ba11ee2-8f41-49d8-8a35-1b8d0a3bb788.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/0116a872-a8ed-4456-9f2c-6a1c2443eaa1.svg",
    "name": "0116a872-a8ed-4456-9f2c-6a1c2443eaa1.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/87856ef3-0fb7-4f13-8f4b-260eb58a7336.svg",
    "name": "87856ef3-0fb7-4f13-8f4b-260eb58a7336.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/bde06881-9a6f-4eae-88c7-a697340200bc.svg",
    "name": "bde06881-9a6f-4eae-88c7-a697340200bc.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9c4bf4ad-a40f-4374-b36c-fc3c65506372.svg",
    "name": "9c4bf4ad-a40f-4374-b36c-fc3c65506372.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/459b1e21-399e-4f09-b97c-85db96b30057.svg",
    "name": "459b1e21-399e-4f09-b97c-85db96b30057.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/6a63c1d6-d3bd-424d-9b57-a6c17f5cf063.svg",
    "name": "6a63c1d6-d3bd-424d-9b57-a6c17f5cf063.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/7c079ec2-0485-4707-b866-56b92b34b106.svg",
    "name": "7c079ec2-0485-4707-b866-56b92b34b106.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/0eb57e21-0fda-43d1-8dda-c9debe5314b3.svg",
    "name": "0eb57e21-0fda-43d1-8dda-c9debe5314b3.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/ff6678aa-ef33-4a28-a784-b8f6daf2b5bc.svg",
    "name": "ff6678aa-ef33-4a28-a784-b8f6daf2b5bc.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/5515c44c-7d80-4407-baac-b0e13b99972f.svg",
    "name": "5515c44c-7d80-4407-baac-b0e13b99972f.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9585c7a9-5d15-4a07-b6a1-6351b40294c8.svg",
    "name": "9585c7a9-5d15-4a07-b6a1-6351b40294c8.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/42e13402-e916-4a31-ad0c-6da69f78563d.svg",
    "name": "42e13402-e916-4a31-ad0c-6da69f78563d.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/72c7999e-6285-4d2e-9f21-650491b21596.svg",
    "name": "72c7999e-6285-4d2e-9f21-650491b21596.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/f14110c6-0b39-404a-8825-95fc4ee0d389.svg",
    "name": "f14110c6-0b39-404a-8825-95fc4ee0d389.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/2fc29122-f6df-44db-854a-e6c7da561181.svg",
    "name": "2fc29122-f6df-44db-854a-e6c7da561181.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/ddc41850-49f3-4a95-b662-a4be77773e13.svg",
    "name": "ddc41850-49f3-4a95-b662-a4be77773e13.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/d97d4075-48e0-4800-8495-c4886ed4b78d.svg",
    "name": "d97d4075-48e0-4800-8495-c4886ed4b78d.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/8f0854d9-4b6b-4af9-aea8-571b88efe33c.svg",
    "name": "8f0854d9-4b6b-4af9-aea8-571b88efe33c.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/fbf42cbc-fa52-45fd-97b9-bd378945cb81.svg",
    "name": "fbf42cbc-fa52-45fd-97b9-bd378945cb81.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/a31421f0-6e68-4529-8918-0f554c657fa1.svg",
    "name": "a31421f0-6e68-4529-8918-0f554c657fa1.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/c8fd427e-5c62-4113-bc4c-5ab2638a222e.svg",
    "name": "c8fd427e-5c62-4113-bc4c-5ab2638a222e.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/cb21d588-96e4-4690-abe1-467af41842c7.png",
    "name": "cb21d588-96e4-4690-abe1-467af41842c7.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/ebd3de7f-1f3b-4dae-b236-8a04ad5ddc57.png",
    "name": "ebd3de7f-1f3b-4dae-b236-8a04ad5ddc57.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/070bebf7-8a89-4f36-9a00-0a7d4192d0ca.png",
    "name": "070bebf7-8a89-4f36-9a00-0a7d4192d0ca.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/c26f18d1-3971-4df5-a2c1-161e17f1e60b.svg",
    "name": "c26f18d1-3971-4df5-a2c1-161e17f1e60b.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/75a184fb-f40b-4f2e-b090-5fb098ef763d.svg",
    "name": "75a184fb-f40b-4f2e-b090-5fb098ef763d.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/a50bb4a5-48f1-480a-ae32-6a5944762414.svg",
    "name": "a50bb4a5-48f1-480a-ae32-6a5944762414.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/625f7940-04a1-4ca2-a089-6b2767df50b1.svg",
    "name": "625f7940-04a1-4ca2-a089-6b2767df50b1.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/4b07d533-8cb7-42ff-98b0-e40fe019c6ff.svg",
    "name": "4b07d533-8cb7-42ff-98b0-e40fe019c6ff.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/3eab95f5-5bc8-4b56-88ec-eb6681be400d.svg",
    "name": "3eab95f5-5bc8-4b56-88ec-eb6681be400d.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/d8d289fa-a6a6-406e-bdd9-58d6fc9d4049.svg",
    "name": "d8d289fa-a6a6-406e-bdd9-58d6fc9d4049.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/efcea0e3-b83a-4cf0-831a-34390485b391.svg",
    "name": "efcea0e3-b83a-4cf0-831a-34390485b391.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/1b4a70d5-55c4-4ac4-91a1-23b0dd1c8d17.svg",
    "name": "1b4a70d5-55c4-4ac4-91a1-23b0dd1c8d17.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/3f97c3d9-acbf-4644-9ca0-bb26004a821b.svg",
    "name": "3f97c3d9-acbf-4644-9ca0-bb26004a821b.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/8b91614a-d496-4396-ae4e-6e99246a63ea.svg",
    "name": "8b91614a-d496-4396-ae4e-6e99246a63ea.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9b1039e0-f85e-45a6-bbad-03e8802a3d81.svg",
    "name": "9b1039e0-f85e-45a6-bbad-03e8802a3d81.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/4f1108d3-d215-4c78-abce-179f106457aa.svg",
    "name": "4f1108d3-d215-4c78-abce-179f106457aa.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/2dc62f54-f9fc-46ce-8d67-4c54d7901e5b.svg",
    "name": "2dc62f54-f9fc-46ce-8d67-4c54d7901e5b.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/f7310491-f8c4-41b0-b3bf-0c3203141cb2.svg",
    "name": "f7310491-f8c4-41b0-b3bf-0c3203141cb2.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/4de22dcf-7e73-48f1-9360-d5b2738b2721.svg",
    "name": "4de22dcf-7e73-48f1-9360-d5b2738b2721.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/2fda4f67-5aa7-4725-9c3d-9da2897e7e3e.svg",
    "name": "2fda4f67-5aa7-4725-9c3d-9da2897e7e3e.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/1b74a975-aea9-4c6c-8c34-3b7f0c5d0b76.svg",
    "name": "1b74a975-aea9-4c6c-8c34-3b7f0c5d0b76.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/ce3e2c93-7afc-4e00-b945-c12b7f70501a.svg",
    "name": "ce3e2c93-7afc-4e00-b945-c12b7f70501a.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/b98e60ba-069b-4dea-839b-ec0ba31df0d6.svg",
    "name": "b98e60ba-069b-4dea-839b-ec0ba31df0d6.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/f7ac4061-6ef6-4f7a-be46-d8be498ee3ff.svg",
    "name": "f7ac4061-6ef6-4f7a-be46-d8be498ee3ff.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/750a5d79-98d1-4ec0-9584-c8c507144155.svg",
    "name": "750a5d79-98d1-4ec0-9584-c8c507144155.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9ef6e9c0-ef20-4e64-8387-4edced252c2b.svg",
    "name": "9ef6e9c0-ef20-4e64-8387-4edced252c2b.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/0c951348-d4ae-40c0-b66c-1d23ff57ec23.svg",
    "name": "0c951348-d4ae-40c0-b66c-1d23ff57ec23.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9d79d0e3-d14c-4eee-88c9-d38b34f4ce0c.svg",
    "name": "9d79d0e3-d14c-4eee-88c9-d38b34f4ce0c.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/c332d0ba-d35d-43a3-9e88-8befbd69dbb7.svg",
    "name": "c332d0ba-d35d-43a3-9e88-8befbd69dbb7.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9f12da5d-567f-44c8-b377-ea13e07baf00.svg",
    "name": "9f12da5d-567f-44c8-b377-ea13e07baf00.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/a3d72aa2-10f2-491d-9230-1566f3ad81ee.svg",
    "name": "a3d72aa2-10f2-491d-9230-1566f3ad81ee.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/39daa180-ec23-49cd-938f-894cda1ed4eb.svg",
    "name": "39daa180-ec23-49cd-938f-894cda1ed4eb.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/f677fd63-1820-49ca-befa-8ec00e936561.svg",
    "name": "f677fd63-1820-49ca-befa-8ec00e936561.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/dc2f6e52-8763-4d68-9245-68654579e1fb.svg",
    "name": "dc2f6e52-8763-4d68-9245-68654579e1fb.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/7281dbe4-761d-4219-be5e-5042f43fbb8a.svg",
    "name": "7281dbe4-761d-4219-be5e-5042f43fbb8a.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/d4ab3f5a-e485-4f0f-9b99-e77b30f08959.svg",
    "name": "d4ab3f5a-e485-4f0f-9b99-e77b30f08959.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/2e677c5b-b122-4362-abee-34c24b06bf88.svg",
    "name": "2e677c5b-b122-4362-abee-34c24b06bf88.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/f80133fe-7669-4f13-8c19-7d56e2a37fc8.svg",
    "name": "f80133fe-7669-4f13-8c19-7d56e2a37fc8.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/b7972883-8e5a-44fc-b988-d4287828f281.svg",
    "name": "b7972883-8e5a-44fc-b988-d4287828f281.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/807a47d7-f1be-4f2c-a3ce-8b317d61113b.svg",
    "name": "807a47d7-f1be-4f2c-a3ce-8b317d61113b.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/15e1083c-224e-4868-b5a4-bef979160d46.svg",
    "name": "15e1083c-224e-4868-b5a4-bef979160d46.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/a28bde61-9b61-4492-b3a0-e1d094bea0fe.svg",
    "name": "a28bde61-9b61-4492-b3a0-e1d094bea0fe.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9c6493c3-9749-4a55-a966-3b460084454a.svg",
    "name": "9c6493c3-9749-4a55-a966-3b460084454a.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/85679fef-c387-4791-884e-a64641ab256c.svg",
    "name": "85679fef-c387-4791-884e-a64641ab256c.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/ac9da33f-7189-495f-a52f-9cdf29346422.svg",
    "name": "ac9da33f-7189-495f-a52f-9cdf29346422.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/3eabf1ba-29a9-47e4-98f9-dd269b4934fd.svg",
    "name": "3eabf1ba-29a9-47e4-98f9-dd269b4934fd.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/1a05e1cf-0b8a-4189-a2b4-daaab977d798.svg",
    "name": "1a05e1cf-0b8a-4189-a2b4-daaab977d798.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/36f8aada-426a-40e5-8628-c079091d9401.svg",
    "name": "36f8aada-426a-40e5-8628-c079091d9401.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/65394bb0-4daa-4e2f-8c44-63a003989939.svg",
    "name": "65394bb0-4daa-4e2f-8c44-63a003989939.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/db8a04af-a6e7-4b8a-96a2-9dac51471cc6.svg",
    "name": "db8a04af-a6e7-4b8a-96a2-9dac51471cc6.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/449100f2-86be-444e-ab5c-04a9cc9a69e1.svg",
    "name": "449100f2-86be-444e-ab5c-04a9cc9a69e1.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/8c695555-d83e-43c2-af49-8b37cbc44093.svg",
    "name": "8c695555-d83e-43c2-af49-8b37cbc44093.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/b9d0142d-df34-44e0-9881-73efc029ecb9.svg",
    "name": "b9d0142d-df34-44e0-9881-73efc029ecb9.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/010ebf91-1191-4a50-baac-fbb5a54baf1c.svg",
    "name": "010ebf91-1191-4a50-baac-fbb5a54baf1c.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/0e8ed6d3-83eb-4ee7-8841-82f641b04c9f.svg",
    "name": "0e8ed6d3-83eb-4ee7-8841-82f641b04c9f.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/5af10af4-38f9-4d73-93d7-cc1f5f11ec42.svg",
    "name": "5af10af4-38f9-4d73-93d7-cc1f5f11ec42.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9fad0326-4852-4332-be8c-e78e97850001.svg",
    "name": "9fad0326-4852-4332-be8c-e78e97850001.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9ef318b5-6f22-4b09-8738-e25368615a27.svg",
    "name": "9ef318b5-6f22-4b09-8738-e25368615a27.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/ff8ebef7-a1e0-405d-9d46-68b37194fa2b.svg",
    "name": "ff8ebef7-a1e0-405d-9d46-68b37194fa2b.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/3d02f989-aa8e-4b42-8805-53a7c0fba211.svg",
    "name": "3d02f989-aa8e-4b42-8805-53a7c0fba211.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/a68e66e8-157d-4ad9-9ddf-0772fb342e52.svg",
    "name": "a68e66e8-157d-4ad9-9ddf-0772fb342e52.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/f14cda3c-fb59-4ca0-90cf-a94f8abb4bda.svg",
    "name": "f14cda3c-fb59-4ca0-90cf-a94f8abb4bda.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/3444a5c2-bf43-4c2b-9b04-ad1d256e449e.svg",
    "name": "3444a5c2-bf43-4c2b-9b04-ad1d256e449e.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/1a78c6ca-a98f-4b0c-976c-707e700b0bed.svg",
    "name": "1a78c6ca-a98f-4b0c-976c-707e700b0bed.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/443c2117-d3df-42a5-b2a9-aa2530ce1b80.svg",
    "name": "443c2117-d3df-42a5-b2a9-aa2530ce1b80.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/922201c3-5627-4de1-a8f2-9e4292ef0770.svg",
    "name": "922201c3-5627-4de1-a8f2-9e4292ef0770.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/dc4b2ccb-cb5a-4312-9cab-1dd68e4eecce.svg",
    "name": "dc4b2ccb-cb5a-4312-9cab-1dd68e4eecce.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/6a9b00ad-aec8-41ea-b285-922d41de95b0.svg",
    "name": "6a9b00ad-aec8-41ea-b285-922d41de95b0.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/b9c39984-1e9e-424a-9fc6-3b9a3246e28d.svg",
    "name": "b9c39984-1e9e-424a-9fc6-3b9a3246e28d.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/63947eca-613d-4fe1-ace8-9c3fec1efa9d.svg",
    "name": "63947eca-613d-4fe1-ace8-9c3fec1efa9d.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/6547dd9c-7324-45ba-a55e-ba77550ce495.png",
    "name": "6547dd9c-7324-45ba-a55e-ba77550ce495.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/01297b99-3913-4145-83e1-e09cdfb2e605.png",
    "name": "01297b99-3913-4145-83e1-e09cdfb2e605.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/72e77f63-2eab-4747-be4d-495bf9eaef93.png",
    "name": "72e77f63-2eab-4747-be4d-495bf9eaef93.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/4053a7cf-f68e-439e-8e68-644304cf80ec.svg",
    "name": "4053a7cf-f68e-439e-8e68-644304cf80ec.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/3b534a5a-d690-4e22-9d65-a90f0d389fa4.svg",
    "name": "3b534a5a-d690-4e22-9d65-a90f0d389fa4.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/7176ba77-d520-440f-85a9-d49fab877222.svg",
    "name": "7176ba77-d520-440f-85a9-d49fab877222.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/20e753f5-992f-48cb-9e17-0bca0870a31e.svg",
    "name": "20e753f5-992f-48cb-9e17-0bca0870a31e.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/25ffe5d3-2c92-49e9-aca4-74a2e0ccaf5f.png",
    "name": "25ffe5d3-2c92-49e9-aca4-74a2e0ccaf5f.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/7ed73054-2810-4a55-b35a-85a1d724909e.png",
    "name": "7ed73054-2810-4a55-b35a-85a1d724909e.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/99a63e42-b600-4350-b843-d7d42143ee18.png",
    "name": "99a63e42-b600-4350-b843-d7d42143ee18.png"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/4039e9a2-d77e-46d7-836f-6e5b4abdf8b7.svg",
    "name": "4039e9a2-d77e-46d7-836f-6e5b4abdf8b7.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/83118e2e-783f-43df-9e1c-440ba9fd81ff.svg",
    "name": "83118e2e-783f-43df-9e1c-440ba9fd81ff.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/830069b1-c79d-451b-ae39-5b5896688c5b.svg",
    "name": "830069b1-c79d-451b-ae39-5b5896688c5b.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/7afa1bcf-cd51-49a0-a3ee-993270e85b63.svg",
    "name": "7afa1bcf-cd51-49a0-a3ee-993270e85b63.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/bde006ab-cd3d-47cc-9eea-7bedd87756ac.svg",
    "name": "bde006ab-cd3d-47cc-9eea-7bedd87756ac.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/a5c8ce35-422d-4d22-863e-5b005e8bfb4c.svg",
    "name": "a5c8ce35-422d-4d22-863e-5b005e8bfb4c.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/fb6f9f5d-8c42-48be-8ee7-31ea12dc628a.svg",
    "name": "fb6f9f5d-8c42-48be-8ee7-31ea12dc628a.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/9d64717d-9a73-4152-a2a1-a2a6633cfb55.svg",
    "name": "9d64717d-9a73-4152-a2a1-a2a6633cfb55.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/380fceb5-3821-4f9e-bbc4-4faaa060127d.svg",
    "name": "380fceb5-3821-4f9e-bbc4-4faaa060127d.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/74b31228-ea85-4542-b1a7-50ae736cf8d9.svg",
    "name": "74b31228-ea85-4542-b1a7-50ae736cf8d9.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/2867bb24-1c7a-44bc-a621-2768d6cbc43d.svg",
    "name": "2867bb24-1c7a-44bc-a621-2768d6cbc43d.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/8e056dc1-57c4-4be0-ae55-676cf3dbfff6.svg",
    "name": "8e056dc1-57c4-4be0-ae55-676cf3dbfff6.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/31c44395-3c4e-4636-b0a7-97d2fc6e4b42.svg",
    "name": "31c44395-3c4e-4636-b0a7-97d2fc6e4b42.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/d258587d-04b6-4389-8b19-9e992b509ddf.svg",
    "name": "d258587d-04b6-4389-8b19-9e992b509ddf.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/c2707521-20fd-4937-a870-f6e38e2afeec.svg",
    "name": "c2707521-20fd-4937-a870-f6e38e2afeec.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/3f0ffa61-c215-43fb-9400-ac1b0b8c1454.svg",
    "name": "3f0ffa61-c215-43fb-9400-ac1b0b8c1454.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/dc39ded0-f912-4421-b2b8-304fa9548a99.svg",
    "name": "dc39ded0-f912-4421-b2b8-304fa9548a99.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/f8030567-cb15-4a94-8389-f72a275b48c7.svg",
    "name": "f8030567-cb15-4a94-8389-f72a275b48c7.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/d30f933b-bc6c-48ea-8736-fbb0e94814a0.svg",
    "name": "d30f933b-bc6c-48ea-8736-fbb0e94814a0.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/7d1223ab-85a9-4dda-abf4-3cffb758ef99.svg",
    "name": "7d1223ab-85a9-4dda-abf4-3cffb758ef99.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/1352ad80-4401-401d-845d-c2d2deff5e9d.svg",
    "name": "1352ad80-4401-401d-845d-c2d2deff5e9d.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/ab7a8209-4ef8-4773-b67a-79f82aa7f943.svg",
    "name": "ab7a8209-4ef8-4773-b67a-79f82aa7f943.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/76f18b14-4046-409e-8166-b99ba701a669.svg",
    "name": "76f18b14-4046-409e-8166-b99ba701a669.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/33f200f5-cdcf-45b2-8ef3-c8b3c99c24c7.svg",
    "name": "33f200f5-cdcf-45b2-8ef3-c8b3c99c24c7.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/a2bd8e7d-4bf3-4c94-967b-b7f977ec87e7.svg",
    "name": "a2bd8e7d-4bf3-4c94-967b-b7f977ec87e7.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/03a9870a-0733-49bd-9e7d-d8137318709e.svg",
    "name": "03a9870a-0733-49bd-9e7d-d8137318709e.svg"
  },
  {
    "url": "https://www.figma.com/api/mcp/asset/34da1173-794d-4e79-acfa-ea38ddf47cd0.svg",
    "name": "34da1173-794d-4e79-acfa-ea38ddf47cd0.svg"
  }
];
let completed=0;
async function worker(){
 while(queue.length){
  const item=queue.shift();const target=path.join(destination,item.name);
  if((await stat(target).catch(()=>null))?.size>0){completed++;continue;}
  await new Promise((resolve,reject)=>{
   const child=spawn('curl.exe',['-L','--fail','--silent','--show-error','--retry','2','--connect-timeout','10','--max-time','90','--output',target,item.url],{stdio:'inherit',windowsHide:true});
   child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error('Download falhou: '+item.name)));
  });
  completed++;console.log(completed+' assets prontos');
 }
}
await Promise.all(Array.from({length:6},worker));
console.log('Assets locais prontos: '+completed);

