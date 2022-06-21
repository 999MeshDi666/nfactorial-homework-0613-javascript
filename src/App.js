import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";
import { TodoistApi } from '@doist/todoist-api-typescript'
const buttons = [
  
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Uncompleted",
  },
];


const MY_TOKEN = "17e86e1ee68a9983d362dff001a62ff72ceb2786";
const TODOIST_API = new TodoistApi('17e86e1ee68a9983d362dff001a62ff72ceb2786');

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterType, setFilterType] = useState("active");
  const [completedItems, setCompletedItems] = useState([]);

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
  
    TODOIST_API.addTask({
      content: itemToAdd,
      priority: 1,
      completed: false,
     
    }).then((task) =>  
        setItems([ ...items, task]
      ))
      .catch((error) => 
        console.log(error)
      )
    setItemToAdd("");

  };

  const handleFilterItems = (type) =>{
    setFilterType(type);
  }

  const handleItemDelete = (id) => {
    TODOIST_API.closeTask(id).then(() => {
        
        const newItems = items.filter((item) => {
          return id !== item.id
        })
        setItems(newItems)
    })
  };
  const handleReturnInCompleted = (item) =>{
    TODOIST_API.reopenTask(item.task_id).then(() => {
        
      const newItems = completedItems.filter((reItem) => {
        return item.task_id !== reItem.id
      })
      if(newItems.length === completedItems -1){
        setCompletedItems(newItems);
        // setItems(...items, item)
      }
  })
  }



  useEffect(() => {
      
    TODOIST_API.getTasks()
      .then((tasks) => setItems(tasks))
      .catch((error) => console.log(error))


      axios.get(`https://api.todoist.com/sync/v8/completed/get_all`,{
        headers: {
          Authorization: `Bearer ${MY_TOKEN}`,
        }
      }).then((response) => {
        setCompletedItems(response.data.items);
    })  
  }, [items])





  
  const filteredItems =
    filterType === "active" ? items : completedItems;

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />

        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list"> 
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item`}>
                <span
                  className="todo-list-item-label"
                  onClick={()=> handleReturnInCompleted(item)}
                  >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
