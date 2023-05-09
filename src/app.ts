import express from 'express';  //การนำเข้า module ชื่อ express=เป็น framework สำหรับการพัฒนา web application ช่วยจัดการกับ HTTP requests, route และ middleware
import * as dotenv from 'dotenv'; //*asนำเข้าข้อมูลทั้งหมดของModuleแล้วกำหนดชื่อ, dotenvเป็นแพ็คเก็จจัดการกับ environment variable(กำหนดค่าตัวแปรต่างๆเช่น database hostname,user,password)
import bodyParser from 'body-parser'; //body-parser(middleware การจัดการกับ request body ในการส่งข้อมูลผ่าน HTTP request แบบ POST, PUT, DELETE, PATCH โดย bodyParser จะทำการ parse request body(req.body)ในรูปแบบต่างๆex.JSON เข้าถึงและใช้งานข้อมูลได้ใน middleware ต่อไป)
import cors from 'cors'; //ช่วยจัดการการเรียกข้อมูลระหว่างโดเมนต่างๆ อนุญาตให้เว็บไซต์เข้าถึงข้อมูลได้
import routers from 'routes';//กำหนดและช่วยจัดการ route(เส้นทาง)
import { HandleThrowError } from 'utils';//เป็น function เขียนเองในไฟล์ utils ซึ่งสามารถนำมาใช้ในการจัดการ error ที่เกิดขึ้นในการทำงานของเว็บแอปพลิเคชัน 


// เพิ่มไฟล์ใหม่
import { DataSource} from 'typeorm'; // import คลาส DataSource(ใช้เชื่อมต่อกับฐานข้อมูล) จาก TypeORM
import { product } from 'entities/product'; // import entities ของ product.ts
const MysqlDataSource  = new DataSource({ // สร้าง object DataSource และกำหนดค่าการเชื่อมต่อฐานข้อมูล MySQL
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "funch",
  database: "yourdb",

  entities: [product], //บอกว่ามีmodelไหนบ้างที่เชื่อมต่อ

  synchronize: true, //เปิดใช้งานการสร้างตารางใหม่ ถ้าไม่มีตารางไม่ขึ้น
})

MysqlDataSource.initialize() //check  เพื่อเตรียมเริ่มต้นการทำงานกับฐานข้อมูล MySQL
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })


dotenv.config();//เรียกใช้Fn configจาก.dev แล้วโหลดค่าenv variableและตั้งค่าในระบบos ช่วยให้deployง่ายขึ้น

const port = process.env.PORT || 8081;//กำหนดค่าตัวแปร port ด้วยการใช้ process.env.PORTถ้าไม่ใช้8081 
const app = express();//สร้างinstanceเก็บไว้ในตัวแปรapp เพื่อใช้งานmedthodและmiddleware,สร้าง web serverรับส่งreq,resกลับไปยังclientที่reqมา

app.use(cors());//การใช้ middleware ทำการเพิ่มheaderของresponse เพื่ออนุญาตให้client ใช้APIของserverได้โดยไม่error
app.use(express.urlencoded({ extended: true }));//ใช้middleware Express urlencoded การแปลงข้อมูลที่อยู่ใน URL query string หรือ form data ให้อยู่ในรูปแบบของ key-value pairs
app.use(bodyParser.json());//ใช้แปลง request body ที่เป็น JSON (ใช้กรณีv.expressต่ำกว่า4.16.0)
app.use(express.json());//เหมือนbodyparserแต่ดีกว่า 

// routers.forEach(({ baseUrl, router }) => {
//   app.use(baseUrl, router);//จะเป็นการนำ baseUrl มานำทางroute ทั้งหมดในrouterนั้น แล้วส่งให้express จัดการ 
// });

app.use(HandleThrowError);//ทำหน้าที่จัดการ error โดยการส่ง response กลับไปยัง client ด้วยข้อมูลของ error 
// const repository = DataSource.getRepository(product)
//getproduct

const productRepository = MysqlDataSource.getRepository(product)
app.get('/product', async (req, res) => { //รับGET req จากclient ที่เข้ามาที่pathของroute/product 
  try { 
    const getproduct = await productRepository.find(); // updated, Find()=method TypeORM ใช้ค้นหาข้อมูลจากฐานข้อมูลตามเงื่อนไข
    //await ต้องอยู่ในFn asyncเท่านั้น เป็นการบอกว่าให้รอproductRepository.find()ทำให้เสร็จก่อน
    return res.json(getproduct);//แปลงข้อมูลเป็น content type json และbody ดึงข้อมูลมาจาก(),ส่งresกลับไปClient
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
    
});

//postproduct
app.post('/product', async (req, res) => {
  try {
    const newProduct = await productRepository.create(req.body);// updated
    // const newProduct = await productRepository.create(req.body); //create instance ของ entity ของProductใหม่ ใช้ข้อมูลจาก req.body
    const existingProduct = await productRepository.findOne({ where: { Name: req.body.Name } });//หาสินค้าที่มีชื่อตรงกับreq.body.Name คืนค่าแบบinstance ของ entity

  if (existingProduct) { //ถ้าซ้ำแจ้งข้างล่าง
    return res.status(400).json({ message: 'Product already exists' });
  }  
  await productRepository.save(newProduct); //บันทึก instance ของ entity "newProduct"
    return res.json(newProduct);
    
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
});

//////put updateพี่ธ้ง สอน
app.put('/product/:id', async (req, res) => { //กำหนดroute Expressเป็นHTTP method PUT และ path /product/:id(dynamic parameter ที่สามารถรับค่าได้จาก client และส่งต่อให้ฟังก์ชันที่กำหนดไว้ใน callback function
  const productId = parseInt( req.params.id); //Fn parseInt() ซึ่งจะเปลี่ยน string เป็นจำนวนเต็ม (integer)
  const update = req.body; //ข้อมูลที่ client ส่งมาใน body ของ HTTP req
  const productToUpdate = await productRepository.findOne({ where: { Id: productId } });

  if (productToUpdate) { //ถ้าเจอidที่ต้องการ
  let test = await productRepository.update({ Id: productId }, { Name: update.Name,Price:update.Price }); //ให้ทำการอัพเเดทproductRepository เก็บในtest
  // const productNew = await productRepository.findOne({ where: { Id: productId } });

    res.json(productToUpdate);
  } else {
    res.status(404).send(`Product with ID '${productId}' not found`);
  }
});

//Deletekub
app.delete('/product/:id', async (req, res) => {
  try {
    const productId = parseInt( req.params.id);//Fn parseInt() ซึ่งจะเปลี่ยน string เป็นจำนวนเต็ม (integer)
    const productToDelete = await productRepository.findOne({ where: { Id: productId } });
    if (!productToDelete) {//เครื่องหมาย! สมมติว่ามีobj 3 ช่อง a,b,c ถ้าไม่มีค่าให้ส่งundefineออกไป ปกติถ้าไม่มีจะแตก
      res.status(404).send('Product not found');
    } else {
      await productRepository.remove(productToDelete);//ลบข้อมูลในฐานข้อมูลของ Entityด้วย Idที่ต้องการลบออกจากฐานข้อมูล
      res.json(productToDelete);
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

//get id
app.get('/product/:id', async (req, res) => {
  try {
    const productId = parseInt( req.params.id);//Fn parseInt() ซึ่งจะเปลี่ยน string เป็นจำนวนเต็ม (integer)
    const productToread = await productRepository.findOne({ where: { Id: productId } });
    if (!productToread) {
      res.status(404).send(`Product with ID '${productId}' not found`);
    } else {
      res.json(productToread);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


const start = async (): Promise<void> => { //ฟังก์ชัน start() ถูกกำหนดเป็น async function และมีการระบุว่าจะส่งคืน Promise ชนิด void หมายความว่าฟังก์ชันนี้จะไม่ส่งค่าใด ๆ กลับมา

  try {
  // createConnection();// สร้าง connection กับ database โดยใช้ค่า config จาก ormconfig.json
  //typeorm ใช้ไฟล์ ormconfig.json เพื่อเก็บค่าการกำหนดค่าต่างๆที่เกี่ยวข้องกับการเชื่อมต่อฐานข้อมูล เช่น ชื่อฐานข้อมูล, username, password, host, port, และ configuration อื่นๆ เพื่อที่จะเป็นไปได้ว่า typeorm จะไม่ต้องถูกตั้งค่าใหม่ทุกครั้งที่มีการเรียกใช้งาน ซึ่งเป็นการลดภาระการทำงานในการกำหนดค่าฐานข้อมูลแต่ละครั้ง
  //ยังช่วยให้สามารถสลับการเชื่อมต่อฐานข้อมูลได้ง่ายขึ้น โดยไม่จำเป็นต้องแก้ไขรหัสของแอปพลิเคชัน หรือตัวแปรอื่นๆ ซึ่งทำให้การเปลี่ยนแปลงฐานข้อมูลหรือการเชื่อมต่อกับฐานข้อมูลที่ต่างกันสามารถทำได้อย่างง่ายดาย  
  //นอกจากนี้ การใช้ไฟล์ ormconfig.json ยังช่วยให้สามารถใช้ git หรือเครื่องมือร่วมทีมอื่นๆ ในการจัดการการกำหนดค่าฐานข้อมูลได้ง่ายขึ้น เพราะไฟล์นี้สามารถเก็บไว้ใน source control และทำให้สามารถส่งไปยังผู้ใช้งานได้อย่างง่ายดาย และมีประสิทธิภาพสูง

    app.listen(port, () => {
      console.log(`NODE_ENV=${process.env.NODE_ENV}`);
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);//ถ้าerror ในการ start server ให้ทำการปิด server และออกจาก process ทันที
  }
};

start();

//java script ส่วนใหญ้เป็นasync(รันพร้อมกัน เสร็จก่อนแสดงผลลัพธ์ก่อน) อยู่แล้ว 
