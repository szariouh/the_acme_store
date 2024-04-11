const { 
    client, 
    createTables,
    createUser, 
    createProduct,
    createFavorite,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    destroyFavorite
} = require('./db');

const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/products', async(req, res, next)=> {
  try {
    res.send(await fetchProducts());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users/:id/favorites', async(req, res, next)=> {
  try {
    res.send(await fetchFavorites(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/users/:userId/favorites/:id', async(req, res, next)=> {
  try {
    await destroyFavorite({ user_id: req.params.userId, id: req.params.id });
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/users/:id/favorites', async(req, res, next)=> {
  try {
    res.status(201).send(await createFavorite({user_id: req.params.id, product_id: req.body.product_id}));
  }
  catch(ex){
    next(ex);
  }
});


const init = async()=> {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [user1, user2, user3, user4, product1, product2, product3, product4] = await Promise.all([
        createUser({ username: 'moe', password: 'moe_pw'}),
        createUser({ username: 'sara', password: 'sara_pw'}),
        createUser({ username: 'adam', password: 'adam_pw'}),
        createUser({ username: 'mery', password: 'mery_pw'}),
        createProduct({ name: 'laptop'}),
        createProduct({ name: 'smartphone'}),
        createProduct({ name: 'tablet'}),
        createProduct({ name: 'smartwatch'})
      ]);
    
      console.log(await fetchUsers());
      console.log(await fetchProducts());
    
      const favorites = await Promise.all([
        createFavorite({ user_id: user1.id, product_id: product1.id}),
        createFavorite({ user_id: user1.id, product_id: product2.id}),
        createFavorite({ user_id: user3.id, product_id: product3.id}),
        createFavorite({ user_id: user3.id, product_id: product4.id})
      ]);
      console.log(await fetchFavorites(user1.id));
      await destroyFavorite({ user_id: user1.id, id: favorites[0].id});
      console.log(await fetchFavorites(user1.id));
    
      console.log(`curl localhost:3000/api/users/${user3.id}/favorites`);
    
      console.log(`curl -X POST localhost:3000/api/users/${user3.id}/favorites -d '{"product_id": "${product2.id}"}' -H 'Content-Type:application/json'`);
      console.log(`curl -X DELETE localhost:3000/api/users/${user3.id}/favorites/${favorites[3].id}`);
      
      console.log('data seeded');
    
      const port = process.env.PORT || 3000;
      app.listen(port, ()=> console.log(`listening on port ${port}`));
    
}

init();
    