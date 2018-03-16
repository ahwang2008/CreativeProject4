const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let items = [];
let id = 0;

app.delete('/api/items/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let removeIndex = items.map(item => { return item.id; }).indexOf(id);
    if (removeIndex === -1) {
      res.status(404).send("Sorry, that item doesn't exist");
      return;
    }
    items.splice(removeIndex, 1);
    res.sendStatus(200);
  });

app.get('/api/items', (req, res) => {
  res.send(items);
});

app.post('/api/items', (req, res) => {
  id = id + 1;
  let item = {
     id:id,
     text:req.body.text, 
     text1:req.body.text1,
     completed: req.body.completed, 
     priority:req.body.priority
    };
  items.push(item);
  res.send(item);
});

app.put('/api/items/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let itemsMap = items.map(item => { return item.id; });
    let index = itemsMap.indexOf(id);
    let item = items[index];
    item.completed = req.body.completed;
    item.text = req.body.text;
    item.text1 = req.body.text1;
    item.priority = req.body.priority;
    // handle drag and drop re-ordering
    if (req.body.orderChange) {
      let indexTarget = itemsMap.indexOf(req.body.orderTarget);
      items.splice(index,1);
      items.splice(indexTarget,0,item);
    }
    if (req.body.priorityUp) {
      if (req.body.priority == 50) {
        item.priority = 50;
      }
      else {
        item.priority = item.priority - 1 + 2;
      }
    }
    else if (req.body.priorityDown) {
      if (req.body.priority == 1) {
        item.priority = 1;
      }
      else {
        item.priority = item.priority - 1;
      }
    }
    res.send(item);
  });

app.listen(3000, () => console.log('Server listening on port 3000!'))