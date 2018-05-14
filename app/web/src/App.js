import './App.scss';

function App() {

 const getTracks = async () => {
    axios.get('http://localhost:9000/album2track')
 }

  return (
    <div className="App">
    <button onClick={getTracks}>get tracks</button>
    </div>
  );
}

export default App;
