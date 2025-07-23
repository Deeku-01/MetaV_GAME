const axios = require("axios");

 
 const BACKEND_URL="http://localhost:3000"
 const WS_URL= "ws://localhost:3001"

//  Describe block 

describe("Authentication",()=>{
    test("User is able to Sign Up only once",async ()=>{
        const username="kirat"+Math.random();
        const password="12345678"
        const response =await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"user"
        })
        expect(response.statusCode).toBe(200);
        expect(response.data.userId).toBeDefined()

        //Now he should not signup again
        const updatedResponse =await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"user"
        })

        expect(updatedResponse.statusCode).toBe(400)

    })

    test("Signup Request Fails if the Username is Empty",async()=>{
        const username="kirat"+Math.random();
        const password="12345678"
        const response=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            password,
            type:"admin"
        })
        expect(response.statusCode).toBe(400);
        expect(response.data.userId).toBeDefined()
    })
    

    test('SignIn Succeds if the username and password are correct',async () => {
        const username="kirat"+Math.random();
        const password='12345678'
        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"user"
        })

        const response=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined()

    })


    test('SignIn fails if the username and password are wrong',async () => {
        const username="kirat"+Math.random();
        const password='12345678'

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })
        expect(response.data.userId).toBeDefined()

        const response=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:"WrongUsername",
            password
        })
        expect(response.statusCode).toBe(403)

    })
})

describe("User Information Endpoint",()=>{
    let token="";
    let avatarId="";
    let UserId;


    beforeAll(async()=>{
        const username="kirat"+Math.random()
        const password="12345678"

        const SignUpresponse=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })
        userId=SignUpresponse.data.userId;
        

        const response=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        
        
        token=response.data.token;


        // Create an avatar so that the user can update it along 
        const avatarResponse=await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name":"Timmy"
        })
        avatarId=avatarResponse.data.avatarId;

    })

    test("User cant update their metadata with a wrong avatar id",async ()=>{
         const response=await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId:"1231231"
        },{
            headers:{
                authorization:`Bearer ${token}`
            }
        })

        expect(response.statusCode).toBe(400) 
    })

    test("user Can update their metadata with the right avatar id",async()=>{
        const response=await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        },{
            headers:{
                'authorization':`Bearer ${token}`
            }
        })

        expect(response.statusCode).toBe(200) 
    })

    test("User is not able to update their metadata if auth is header is not present",async()=>{
        const response=await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        })

        expect(response.statusCode).toBe(403) 
    })

    test("Get back Avatar Information for the User",async ()=>{
        const response=await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`)

        expect(response.data.avatars.length).toBe(1)
        expect(response.data.avatars[0].userId).toBe(userId)        
    })

    test("Available Avatars lists the recently created avatar",async () => {
        const response=axios.get(`${BACKEND_URL}/api/v1/avatars`)
        expect(response.data.avatars.length).not.toBe(0);
        const curAvatar=response.data.avatars.find(x=>x.id==avatarId);
        expect(curAvatar).toBeDefined()
    })

})


describe("Space Information",()=>{
    let mapId;
    let ele1Id;
    let ele2Id;
    let adminToken;
    let adminId;

    let userId;
    let userToken;
    let avatarId;

    beforeAll(async()=>{
        const username="kirat"+Math.random()
        const password="12345678"

        const SignUpresponse=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })
        adminId=SignUpresponse.data.userId;

        const response=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        
        
        adminToken=response.data.token;

        const userSignUpResponse= await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username+"-user",
            password,
            type:"user"
        })

        userId=SignUpresponse.userId

        const userSignInResponse= await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username+"-user",
            password
        })

        userToken=userSignInResponse.token;

        const ele1= await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });  

        const ele2= await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });  

        ele1Id=ele1.id;
        ele1Id=ele2.id


        const map=await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "Test space",
            "defaultElements": [{
                    elementId: ele1Id,
                    x: 20,
                    y: 20
                }, {
                  elementId: ele1Id,
                    x: 18,
                    y: 20
                }, {
                  elementId: ele2Id,
                    x: 19,
                    y: 20
                }
            ]
         }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
         })
         

         mapId=map.id;
        

        // Create an avatar so that the user can update it along 
        const avatarResponse=await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            imageUrl:"https://www.google.com/imgres?q=nature&imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fc%2Fc8%2FAltja_j%25C3%25B5gi_Lahemaal.jpg%2F1200px-Altja_j%25C3%25B5gi_Lahemaal.jpg&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FNature_photography&docid=oxi7l2kbi9T7QM&tbnid=Xu5VovIAI2fbKM&vet=12ahUKEwiG8LTPjc6OAxXNSmwGHe9xMyoQM3oECA0QAA..i&w=1200&h=806&hcb=2&ved=2ahUKEwiG8LTPjc6OAxXNSmwGHe9xMyoQM3oECA0QAA",
            name:"Timmy"
        })
        avatarId=avatarResponse.data.avatarId;

    })

    test("User is able to Create a Space",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100x200",
            "mapId":mapId
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })

        expect(response.spaceId).toBeDefined()

    })

    test("User is able to Create a Space without MapId(Empty Space)",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100x200",
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })

        expect(response.spaceId).toBeDefined()

    })

    test("User is not able to Create a Space without mapId and Dimensions",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test"
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })

        expect(response.statusCode).toBe(400)

    })

    test("User is not able to Delete a Space That doesn't exists",async()=>{
        const response= await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExists`,{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })

        expect(response.statusCode).toBe(400)

    })

    test("User is able to Delete a Space that exists",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100x200",
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })

        const deleResponse= await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })

        expect(deleResponse.statusCode).toBe(200)

    })

    test("User Should not be able to delete a space created by another user",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100x200",
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })

        // Trying to delete it via admintoken
        const deleResponse= await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })

        expect(deleResponse.statusCode).toBe(400)
    })
    

    test("Admin has no spaces initially ",async()=>{
        const response=await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        });
        expect(response.data.spaces.length).toBe(0)
    })

     test("Admin Creates and gets his spaces ",async()=>{
        const CreateSpaceResponse=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100x200",
        },{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        });

        const response=await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        });


        const filterspace=response.data.spaces.find(x=>x.id===CreateSpaceResponse.spaceId)
        expect(filterspace).toBeDefined()
        expect(response.data.spaces.length).toBe(1)

    })



})

describe("Arena Endpoints",()=>{
    let mapId;
    let ele1Id;
    let ele2Id;
    let adminToken;
    let adminId;

    let userId;
    let userToken;
    let spaceId;

    beforeAll(async()=>{
        const username="kirat"+Math.random()
        const password="12345678"

        const SignUpresponse=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })
        adminId=SignUpresponse.data.userId;

        const response=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        
        
        adminToken=response.data.token;

        const userSignUpResponse= await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username+"-user",
            password,
            type:"user"
        })

        userId=SignUpresponse.userId

        const userSignInResponse= await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username+"-user",
            password
        })

        userToken=userSignInResponse.token;

        const ele1= await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });  

        const ele2= await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });  

        ele1Id=ele1.id;
        ele1Id=ele2.id


        const map=await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "Test space",
            "defaultElements": [{
                    elementId: ele1Id,
                    x: 20,
                    y: 20
                }, {
                  elementId: ele1Id,
                    x: 18,
                    y: 20
                }, {
                  elementId: ele2Id,
                    x: 19,
                    y: 20
                }
            ]
         }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
         })
         mapId=map.id;
         
         const space=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100x200",
            "mapId":mapId
         },{
            headers:{
                authorization: `Bearer ${userToken}`
            }
         })
         
         spaceId=space.data.spaceId;

    })

    test("Incorrect spaceId returns a 400", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });
        expect(response.status).toBe(400)
    })

    test("Correct spaceId returns all the elements", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });
        expect(response.data.dimensions).toBe("100x200")
        expect(response.data.elements.length).toBe(3)
    })


     test("Delete ewndpoint is able to delete an element", async () => {

        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });
        const deleResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/element`,{
            spaceId:spaceId,
            elementId:response.data.elements[0].id
        },{
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });

        const newResponse= await await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });
        expect(newResponse.data.elements.length).toBe(2)
    })

    test("Adding an element fails if the element lies outside the dimensions", async () => {
        const newResponse = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 10000,
            "y": 210000
        }, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });

        expect(newResponse.status).toBe(400)
    })

    test("Adding an element works as expected", async () => {
        await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": ele1Id,
            "spaceId": spaceId,
            "x": 50,
            "y": 20
        }, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });

        expect(newResponse.data.elements.length).toBe(3)
    })

})

describe("Admin Endpoints",()=>{
    let adminToken;
    let adminId;
    let userToken;
    let userId;

    beforeAll(async () => {
        const username = `kirat-${Math.random()}`
        const password = "123456"
 
        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
         username,
         password,
         type: "admin"
        });

        adminId = signupResponse.data.userId
 
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
         username: username,
         password
        })
 
        adminToken = response.data.token

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        });
   
        userId = userSignupResponse.data.userId
    
        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username  + "-user",
            password
        })
    
        userToken = userSigninResponse.data.token
    });

    test("User is not able to hit admin Endpoints",async ()=>{
        const elementReponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "test space",
            "defaultElements": []
         }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        })

        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        }, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        })

        expect(elementReponse.status).toBe(403)
        expect(mapResponse.status).toBe(403)
        expect(avatarResponse.status).toBe(403)
        expect(updateElementResponse.status).toBe(403)
    })
    test("Admin is able to hit admin Endpoints", async () => {
        const elementReponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "name": "Space",
            "dimensions": "100x200",
            "defaultElements": []
         }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                "authorization": `Bearer ${adminToken}`
            }
        })
        expect(elementReponse.status).toBe(200)
        expect(mapResponse.status).toBe(200)
        expect(avatarResponse.status).toBe(200)
    })

    test("Admin is able to update the imageUrl for an element", async () => {
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        }, {
            headers: {
                "authorization": `Bearer ${adminToken}`
            }
        })

        expect(updateElementResponse.status).toBe(200);

    })
});

describe("Websocket tests",()=>{
    let adminToken;
    let adminId;
    let userId;
    let userToken;

    let mapId;
    let ele1Id;
    let ele2Id;
    let spaceId;

    let ws1;
    let ws2;
    let ws1Messages=[]
    let ws2Messages=[]


    let userX;
    let userY;
    let adminX;
    let adminY;


    async function waitForAndPopLatestMsg(messageArray) {
        return new Promise(r=>{
            if(messageArray.length>0){
                return messageArray.shift();
            }else{
                let interval=setInterval(()=>{
                    if(messageArray.length>0){
                        resolve(messageArray.shift())
                        clearInterval(interval)
                    }
                },100)
            }
        })
    }

    async function setUpHttp() {
        const username="kirat"+Math.random();
        const password="123456"

        const adminSignUpResponse=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })
        adminId=adminSignUpResponse.userId;

        const adminSigninResponse=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        adminToken=adminSigninResponse.token;
       
        const userSignUpResponse=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username+"-user",
            password,
            type:"user"
        })

        userId=userSignUpResponse.userId;

        const userSigninResponse=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username+"-user",
            password
        })

        userToken=userSigninResponse.token;

        const ele1= await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });  

        const ele2= await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });  

        ele1Id=ele1.id;
        ele1Id=ele2.id


        const map=await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "Test space",
            "defaultElements": [{
                    elementId: ele1Id,
                    x: 20,
                    y: 20
                }, {
                  elementId: ele1Id,
                    x: 18,
                    y: 20
                }, {
                  elementId: ele2Id,
                    x: 19,
                    y: 20
                }
            ]
         }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
         })
         mapId=map.id;
         
         const space=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"Test",
            "dimensions":"100x200",
            "mapId":mapId
         },{
            headers:{
                authorization: `Bearer ${userToken}`
            }
         })
         
        spaceId=space.data.spaceId;
    }

    async function setupWs() {
        ws1=new WebSocket(WS_URL)
        
        await new Promise(r=>{
            ws1.onopen=r;
        })
        
        ws1.onmessage=(event)=>{
            ws1Messages.push(JSON.parse(event.data))
        }
        
        ws2=new WebSocket(WS_URL)
        await new Promise(r=>{
            ws2.onopen=r;

        })

        ws2.onmessage=(event)=>{
            ws2Messages.push(JSON.parse(event.data))
        }

    }

    beforeAll(()=>{
        setUpHttp()
        setupWs()
    })

    test("Get Back ack for joining the space",async()=>{

        ws1.send(JSON.stringify({
            "type":"join",
            "payload":{
                "spaceId":spaceId,
                "token":adminToken
            }
        }))
        const message1=await waitForAndPopLatestMsg(ws1Messages);
        

        ws2.send(JSON.stringify({
            "type":"join",
            "payload":{
                "spaceId":spaceId,
                "token":userToken
            }
        }))

        const message2=await waitForAndPopLatestMsg(ws2Messages);
        const message3 = await waitForAndPopLatestMsg(ws1Messages);

        expect(message1.type).toBe("space-joined")
        expect(message2.type).toBe("space-joined")
        expect(message1.payload.users.length).toBe(0)
        expect(message2.payload.users.length).toBe(1)
        expect(message3.type).toBe("user-joined");
        expect(message3.payload.x).toBe(message2.payload.spawn.x);
        expect(message3.payload.y).toBe(message2.payload.spawn.y);
        expect(message3.payload.userId).toBe(userId);


        adminX=message1.payload.spawn.x;
        adminY=message1.payload.spawn.y;

        userX=message2.payload.spawn.x;
        userY=message2.payload.spawn.y;
    })

    test("Admin should not be able to move across the boundary wall",async ()=>{
        ws1.send(JSON.stringify({
            type:"move",
            payload:{
                x:100000,
                y:10000
            }
        }))

        const msg=await waitForAndPopLatestMsg(ws1Messages);
        expect(msg.type).toBe("movement-rejected")
        expect(msg.payload.x).toBe(adminX)
        expect(msg.payload.y).toBe(adminY)

    })


    test("Admin should not be able to move 2 vloacks at the same time",async ()=>{
        ws1.send(JSON.stringify({
            type:"move",
            payload:{
                x:adminX+2,
                y:adminY
            }
        }))

        const msg=await waitForAndPopLatestMsg(ws1Messages);
        expect(msg.type).toBe("movement-rejected")
        expect(msg.payload.x).toBe(adminX)
        expect(msg.payload.y).toBe(adminY)

    })

    test("Correct Movement should be broadcasted to other sockets in room",async ()=>{
        ws1.send(JSON.stringify({
            type:"move",
            payload:{
                x:adminX+1,
                y:adminY,
                userId:adminId
            }
        }))

        const msg=await waitForAndPopLatestMsg(ws2Messages);
        expect(msg.type).toBe("movement")
        expect(msg.payload.x).toBe(adminX)
        expect(msg.payload.y).toBe(adminY)

    })

    test("If a user leaves,the other user recieves a leave event",async ()=>{
        ws1.close()
        const msg=await waitForAndPopLatestMsg(ws2Messages);
        expect(message.type).toBe("user-left")
        expect(message.payload.userId).toBe(adminId)
    })
})
