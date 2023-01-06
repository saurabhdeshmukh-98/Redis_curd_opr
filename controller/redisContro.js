const db = require("../configration/db");
const appConst = require("../constant");
const redis = require("redis");
const redisClient = redis.createClient();
const client = redisClient.connect();

function createKey(body) {
  try {
    let key = " ";
    if (body.id) {
      key = key + `*#id:${req.body.id}#*`;
      console.log(key);
    } else if (body.name) {
      key = key + `*#name:${req.body.name}#*`;
      console.log(key);
    } else if (body.age) {
      key = key + `*#age:${req.body.age}#*`;
      console.log(key);
    }
    console.log(key);
    return key;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: appConst.status.fail,
      key: null,
    });
  }
}

const add = async (req, res) => {
  let key;
  try {
    if (req.body && Array.isArray(req.body)) {
      await db.insertMany(req.body);
      for (let body of req.body) {
        keys = await createKey(body);
        await client.set(keys, JSON.stringify(body));
      }
    } else if (req.body) {
      await db.insertOne(req.body);
      keys = await createKey(req.body);
      await client.set(keys, JSON.stringify(req.body));
    }
    res.status(201).json({
      status: appConst.status.success,
      response: null,
      message: "data inserted successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: "data not inserted....",
    });
  }
};

const fetch = async (req, res) => {
  try {
    let resp = [];
    let key =
      (await (await createKey(req.body.where, "*")).status) ===
      appConst.status.success
        ? await (
            await createKey(req.body.where, "*")
          ).key
        : null;
    await client.set(key, JSON.stringify(req.body.where));

    if (key && key.length > 0) {
      console.log(key)
    }else{
      for (let response of resp) {
        keys = (await (await createRecordKey(response, "")).status) === 
        appConst.status.success ? 
        await (await createRecordKey(response, ""))
        .key:null;
        await client.set(keys, JSON.stringify(response));
      }
    }
    console.log(resp);
    res.status(200).json({
      status: appConst.status.success,
      response: resp,
      message: "data is fetching succefully..",
    });
  } catch (error) {
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: "data is no fetched....",
    });
  }
}

const modify=async(req,res)=>{
    try {
      let resp=[]
      if(req.body.where){
      const key=(await(await createKey(req.body.where,"*")).status)
      ===appConst.status.success ? 
      await(await createKey(req.body.where,"*"))
      .key:null;
      const key= await client.key(key)
      if(key && key.length > 0){
         for(let key of keys){
          await client.del(key);
         }
         const dataUpdate = await body.find(req.body.where).toArray();
      for (let resp of dataUpdate) {
        await body.findOneAndUpdate(
          {_id:resp.id},
          { $set: req.body}
        );
        let response = await body.findOne(resp.id);
        resp.push(response)
        let keys = (await (await createKey(response, "")).status) === 
        appConst.status.success ? 
        await (await createKey(response, ""))
        .key:null;
        await client.set(keys, JSON.stringify(response));
      }
      res.status(200).json({
        status: appConst.status.success, 
        response: resp,
        message: "data updating successfully....."
      })
    }     
    }
    } catch (error) {
      console.log(error)
      res.status(400).json({
        status:appConst.status.success,
        response:null,
        message:"data is not updating....."
      })
    }
}

const remove = async (req, res) => {
  try {
    req.body.where = req.body.where ? req.body.where : {};
    const key =
      (await (await createKey(req.body.where, "*")).status) ===
      appConst.status.success
        ? await (
            await createKey(req.body.where, "*")
          ).key
        : null;
    const keys = await client.keys(key);
    for (let Key of keys) {
      await client.deleteOne(Key);
    }
    let resp = await db.deleteMany(req.body.where);
    console.log(resp);
    res.status(200).json({
      status: appConst.status.success,
      response: resp,
      message: "data deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: appConst.success.fail,
      response: null,
      message: "data is not deleted...",
    });
  }
};
module.exports = {
  add,
  fetch,
  modify,
  remove,
};
