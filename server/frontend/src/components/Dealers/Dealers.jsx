import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);

  const dealer_url = "/djangoapp/get_dealers";
  
  const filterDealers = async (state) => {
    if (state === "All") {
      get_dealers();  // Chiamato di nuovo per ottenere tutti i dealer
      return;
    }
    const url = `/djangoapp/get_dealers/${state}`;
    const res = await fetch(url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) {
      let state_dealers = Array.from(retobj.dealers);
      setDealersList(state_dealers);
    }
  };

  const get_dealers = async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) {
      let all_dealers = Array.from(retobj.dealers);
      let states = [];
      all_dealers.forEach((dealer) => {
        states.push(dealer.state);
      });

      setStates(Array.from(new Set(states)));  // Rimuove i duplicati
      setDealersList(all_dealers);
    }
  };

  useEffect(() => {
    get_dealers();
  }, []);

  let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;

  return (
    <div>
      <Header />
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select
                name="state"
                id="state"
                onChange={(e) => filterDealers(e.target.value)}
              >
                <option value="" selected disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </th>
            {isLoggedIn ? (
              <th>Review Dealer</th>
            ) : <></>}
          </tr>
        </thead>
        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer['id']}</td>
              <td><a href={'/dealer/' + dealer['id']}>{dealer['full_name']}</a></td>
              <td>{dealer['city']}</td>
              <td>{dealer['address']}</td>
              <td>{dealer['zip']}</td>
              <td>{dealer['state']}</td>
              {isLoggedIn ? (
                <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review" /></a></td>
              ) : <></>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;