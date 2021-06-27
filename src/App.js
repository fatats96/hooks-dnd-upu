import React, {useState, useEffect} from 'react';
import './App.css';

const _list = [{
  key: 'unique-1',
  item: 'Item 1'
},{
  key: 'unique-2',
  item: 'Item 2'
},{
  key: 'unique-3',
  item: 'Item 3'
}];

const initialDnDState = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: []
 }
 

function App() {
  const [list, setList] = useState(_list);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);

  const [output, setOutput] = useState([{
    ...initialDnDState,
    message: 'Start to Drag!'
  }]);

  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);
    
    setDragAndDrop({
     ...dragAndDrop,
     draggedFrom: initialPosition,
     isDragging: true,
     originalOrder: list
    });
    
    event.dataTransfer.setData("text/html", '');
   }

   const onDragOver = (event) => {
    event.preventDefault();
    
    let newList = dragAndDrop.originalOrder;
   
    const draggedFrom = dragAndDrop.draggedFrom; 
  
    const draggedTo = Number(event.currentTarget.dataset.position); 
  
    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter((item, index) => index !== draggedFrom);
  
     newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo)
     ];
      
    if (draggedTo !== dragAndDrop.draggedTo){
     setDragAndDrop({
      ...dragAndDrop,
      updatedOrder: newList,
      draggedTo: draggedTo
     })
    }
  
   }

   const onDrop = (event) => {
  
    setList(dragAndDrop.updatedOrder);
    
    setDragAndDrop({
     ...dragAndDrop,
     draggedFrom: null,
     draggedTo: null,
     isDragging: false
    });
   }
  
  
    const onDragLeave = () => {
     setDragAndDrop({
     ...dragAndDrop,
     draggedTo: null
    });
    
   }
 
   useEffect( ()=>{
    const events = [...output];
    events.push(dragAndDrop);
    setOutput(events);
   }, [dragAndDrop])

   useEffect( ()=>{
    console.log("List updated!");
   }, [list])
   

  return (
    <div className="container h-screen mx-auto flex space-x-12 p-4">
      <div className="flex-1 h-full bg-purple-600 rounded-none p-4" id="draggable">
          {list.map((l, index) => 
              <div key={index} className="text-center text-white bg-purple-300 my-1 p-2" data-position={index}  draggable={true} onDrag={console.log}   onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              
              onDragLeave={onDragLeave}> {l.item}</div>
            )}
      </div>
      <div className="flex-1 h-full bg-white rounded-none p-4 overflow-y-scroll">
        {output.map((o, i) => <div key={i} className="text-left text-black p-2">
            {JSON.stringify(o)}
        </div>)}
      </div>
    </div>
  );
}

export default App;
