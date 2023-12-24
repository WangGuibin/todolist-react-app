/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import './App.css';

const TodoCard = ({ item, onDelete, onChecked }) => {
  const [isHovered, setIsHovered] = useState(false);
  const onMouseOver = () => {
    setIsHovered(true);
  };
  const onMouseLeave = () => {
    setIsHovered(false);
  };

  const onChange = (e) => {
    onChecked(e.target.checked);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '10px',
        border: '1px solid black',
        borderRadius: '10px',
        marginBottom: '10px',
        cursor: 'pointer',
        backgroundColor: isHovered ? 'rgb(230,230,230)' : 'white',
      }}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            textDecoration: item.completed ? 'line-through  red' : 'none',
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontSize: '12px',
          }}
        >
          {item.desc}
        </div>
        <div> {item.date} </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <button
          style={{
            display: isHovered ? 'block' : 'none',
            width: '80px',
            height: '40px',
            borderRadius: '10px',
            color: 'white',
            backgroundColor: 'red',
          }}
          onClick={onDelete}
        >
          {' '}
          删除{' '}
        </button>
        <input
          style={{
            marginLeft: '10px',
            width: '30px',
            height: '30px',
          }}
          type="checkbox"
          checked={item.completed}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

const kTodosKey = 'kTodosKey';

function App() {
  const uniqueId = () => {
    return (
      'id-' +
      new Date().getTime().toString(36) +
      '-' +
      Math.random().toString(36).substring(2, 9)
    );
  };

  const getTimeStr = () => {
    return `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  };

  let data = [
    {
      id: uniqueId(),
      title: '吃饭',
      desc: '唯美食不可辜负',
      completed: false,
      date: getTimeStr(),
    },
    {
      id: uniqueId(),
      title: '睡觉',
      desc: '躺平',
      completed: false,
      date: getTimeStr(),
    },
    {
      id: uniqueId(),
      title: '打豆豆',
      desc: '这是一款好玩的游戏',
      completed: false,
      date: getTimeStr(),
    },
  ];

  //尝试从缓存中取一下试试先
  const Jsonstr = localStorage.getItem(kTodosKey) || '{}';
  if (Jsonstr && Jsonstr.length) {
    const todosObj = JSON.parse(Jsonstr) || [];
    if (todosObj.length) {
      data = todosObj;
    }
  }

  const [todos, setTodos] = useState(data);

  const saveDB = useCallback(() => {
    localStorage.setItem(kTodosKey, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    saveDB();
  }, [saveDB, todos]);

  const onClick = () => {
    const todoTitle = prompt('请输入待办事项');
    const todoDesc = prompt('请输入事项的详细内容');
    if (todoTitle && todoDesc) {
      setTodos([
        {
          id: uniqueId(),
          title: todoTitle,
          desc: todoDesc,
          completed: false,
          date: getTimeStr(),
        },
        ...todos,
      ]);
    }
  };

  const onDelete = (item) => {
    setTodos(todos.filter((todo) => todo.title !== item.title));
  };

  const onChecked = (checked, item) => {
    item.completed = checked;
    item.date = getTimeStr();
    let newTodos = todos.sort((a, b) => a.completed - b.completed);
    setTodos([...newTodos]);
  };

  return (
    <>
      <h1>待办事项</h1>
      <button
        style={{
          width: '100px',
          border: '1px solid rgba(0,0,0,0.5)',
          borderRadius: '10px',
          padding: '10px',
          marginBottom: '30px',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
        onClick={onClick}
      >
        {' '}
        添加{' '}
      </button>
      {todos.map((item) => {
        return (
          <TodoCard
            key={item.id}
            item={item}
            onDelete={() => {
              onDelete(item);
            }}
            onChecked={(checked) => {
              onChecked(checked, item);
            }}
          />
        );
      })}
    </>
  );
}
export default App;
