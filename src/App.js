import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectFriend, setSelectedFriend] = useState(null);
  function handleShowAddForm() {
    setShowAddForm((show) => !show);
  }
  function handleAddNewFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }
  function handleSelectFriend(friend) {
    //setSelectedFriend(friend);
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowAddForm(false);
  }
  function onSplitBill(value) {
    setFriends(
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectFriend={selectFriend}
        />
        {showAddForm && <AddFriend onAddNewFriend={handleAddNewFriend} />}
        <Button onClick={handleShowAddForm}>
          {showAddForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill selectFriend={selectFriend} onSplitBill={onSplitBill} />
      )}
    </div>
  );
}

function Friend({ friend, onSelectFriend, selectFriend }) {
  const isSelected = selectFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FriendList({ friends, onSelectFriend, selectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function AddFriend({ onAddNewFriend }) {
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendImg, setNewFriendImg] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!newFriendName || !newFriendImg) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name: newFriendName,
      image: `${newFriendImg}?=${id}`,
      balance: 0,
    };
    onAddNewFriend(newFriend);
    setNewFriendName("");
    setNewFriendImg("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭Friend Name</label>
      <input
        type="text"
        value={newFriendName}
        onChange={(e) => {
          setNewFriendName(e.target.value);
        }}
      />
      <label>🌟Image URL</label>
      <input
        type="text"
        value={newFriendImg}
        onChange={(e) => {
          setNewFriendImg(e.target.value);
        }}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectFriend, onSplitBill }) {
  const [totalBill, setTotalBill] = useState("");
  const [yourExp, setYourExp] = useState("");
  const friendBill = totalBill ? totalBill - yourExp : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSplitBill(e) {
    e.preventDefault();
    if (!totalBill || !yourExp) return;
    onSplitBill(whoIsPaying === "user" ? friendBill : -friendBill);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSplitBill}>
      <h2>Split a bill with {selectFriend.name}</h2>
      <label>💰Bill Value</label>
      <input
        type="text"
        value={totalBill}
        onChange={(e) => setTotalBill(Number(e.target.value))}
      ></input>
      <label>👧Your expense</label>
      <input
        type="text"
        value={yourExp}
        onChange={(e) => setYourExp(Number(e.target.value))}
      ></input>
      <label>👭{selectFriend.name} expense</label>
      <input type="text" value={friendBill} disabled />
      <label>🤑Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
