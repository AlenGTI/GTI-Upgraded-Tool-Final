document.addEventListener("DOMContentLoaded", function () {

  const raffleCriteria = {
    "Retail": {
      Kabul: { "Mond Nano Blue": 5, "Milano Queen Furious Red": 1, "Mond Nano White": 1, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 },
      Herat: { "Mond Nano Blue": 7, "Milano Queen Furious Red": 3, "Mond Nano White": 1, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 },
      Kandahar: { "Mond Nano Blue": 3, "Milano Queen Furious Red": 5, "Mond Nano White": 1, "Milano Fan Pack New York": 3, "Milano Fan Pack London": 1 },
      Jalalabad: { "Mond Nano Blue": 6, "Milano Queen Furious Red": 1, "Mond Nano White": 1, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 },
      Mazar: { "Mond Nano Blue": 6, "Milano Queen Furious Red": 1, "Mond Nano White": 1, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 },
      Helmand: { "Mond Nano Blue": 2, "Milano Queen Furious Red": 4, "Mond Nano White": 1, "Milano Fan Pack New York": 3, "Milano Fan Pack London": 1 },
      Ghazni: { "Mond Nano Blue": 12, "Milano Queen Furious Red": 2, "Mond Nano White": 1, "Milano Fan Pack New York": 2, "Milano Fan Pack London": 1 },
      Konduz: { "Mond Nano Blue": 8, "Milano Queen Furious Red": 1, "Mond Nano White": 2, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 },
      Jozjan: { "Mond Nano Blue": 5, "Milano Queen Furious Red": 1, "Mond Nano White": 1, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 },
      Khost: { "Mond Nano Blue": 7, "Milano Queen Furious Red": 1, "Mond Nano White": 1, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 },
      "Poli Khomre": { "Mond Nano Blue": 6, "Milano Queen Furious Red": 1, "Mond Nano White": 2, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 },
      Parwan: { "Mond Nano Blue": 4, "Milano Queen Furious Red": 1, "Mond Nano White": 1, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 },
      Badakhshan: { "Mond Nano Blue": 1, "Milano Queen Furious Red": 1, "Mond Nano White": 1, "Milano Fan Pack New York": 1, "Milano Fan Pack London": 1 }
    },
    "Semi-Wholesale": { /* same as original */ },
    "Wholesale": { /* same as original */ }
  };

  const defaultBags = {
    "Mond Nano Blue": 2,
    "Milano Queen Furious Red": 2,
    "Mond Nano White": 2,
    "Milano Fan Pack New York": 2,
    "Milano Fan Pack London": 2,
    "Milano Nano Las Vegas Black": 1,
    "Mond QS Red": 1,
    "Momento Nano Black Jet Wave": 1
  };

  const kandaharBags = { ...defaultBags };
  const wholesaleZeroBags = true;

  function updateTargets() {
    const region = document.getElementById("region").value;
    const customerType = document.getElementById("customerType").value;
    if (!region || !customerType) return;

    document.querySelectorAll("#bagTable tbody tr").forEach(row => {
      const product = row.children[0].innerText.trim();
      let bagValue = defaultBags[product];
      if (region === "Kandahar" && kandaharBags[product] !== undefined) bagValue = kandaharBags[product];
      if (customerType === "Wholesale" && wholesaleZeroBags) bagValue = 0;
      row.querySelector(".bag").innerText = bagValue;

      const target = raffleCriteria[customerType]?.[region]?.[product];
      row.querySelector(".raffleTarget").innerText = target ?? "–";
    });
  }

  document.getElementById("region").addEventListener("change", updateTargets);
  document.getElementById("customerType").addEventListener("change", updateTargets);

  function setQualified(el, value) {
    if (value > 0) {
      el.innerText = value;
      el.classList.remove("not-eligible-text");
    } else {
      el.innerText = "Not Eligible";
      el.classList.add("not-eligible-text");
    }
  }

  document.getElementById("calculate").addEventListener("click", function () {
    const btn = this;
    btn.classList.remove("clicked");
    void btn.offsetWidth;
    btn.classList.add("clicked");

    const region = document.getElementById("region").value;
    const customerType = document.getElementById("customerType").value;
    if (!region) return alert("Please select region");
    if (!customerType) return alert("Please select customer type");

    const rows = document.querySelectorAll("#bagTable tbody tr");
    let orders = [], bags = [], allOrdered = true;

    rows.forEach(r => {
      const orderQty = +r.querySelector(".order").value || 0;
      orders.push(orderQty);
      const bagValue = +r.querySelector(".bag").innerText || 0;
      bags.push(bagValue);
      if (orderQty <= 0) allOrdered = false;
    });

    let mhrOuters = 0, mhrBags = 0, indOuters = 0, indBags = 0;

    if (allOrdered && orders.length > 0) {
      const minOrder = Math.min(...orders);
      mhrOuters = orders.reduce((sum,o)=>sum+minOrder,0);
      const bonus = minOrder*2;
      mhrBags = bonus + bags.reduce((sum,val)=>sum+minOrder*val,0);
      orders.forEach((o,i)=>{ const excess = o-minOrder; if(excess>0){ indOuters+=excess; indBags+=excess*bags[i]; } });
    } else {
      orders.forEach((o,i)=>{ indOuters+=o; indBags+=o*bags[i]; });
    }

    setQualified(document.getElementById("mhrOuters"), mhrOuters);
    document.getElementById("mhrBags").innerText = mhrBags;
    const indOutersEl = document.getElementById("indOuters");
    setQualified(indOutersEl, indOuters);
    if(indOuters===0){indOutersEl.innerText="0"; indOutersEl.classList.remove("not-eligible-text");}
    document.getElementById("indBags").innerText=indBags;
    document.getElementById("totalOuters").innerHTML=`<b>${mhrOuters+indOuters}</b>`;
    document.getElementById("totalBags").innerHTML=`<b>${mhrBags+indBags}</b>`;
    document.getElementById("maxBags").innerText=mhrBags+indBags;

    if(customerType==="Wholesale"){
      ["mhrOuters","mhrBags","indOuters","indBags"].forEach(id=>document.getElementById(id).innerText="0");
      document.getElementById("totalOuters").innerHTML="<b>0</b>";
      document.getElementById("totalBags").innerHTML="<b>0</b>";
      document.getElementById("maxBags").innerText=0;
    }

    let tickets = [];
    rows.forEach(r=>{
      const product=r.children[0].innerText.trim();
      if(raffleCriteria[customerType]?.[region]?.[product]){
        const ordered=+r.querySelector(".order").value||0;
        tickets.push(Math.floor(ordered/raffleCriteria[customerType][region][product]));
      }
    });
    const totalTickets = tickets.length ? Math.min(...tickets) : 0;
    const raffleStatusEl = document.getElementById("raffleStatus");
    raffleStatusEl.innerText = totalTickets>0?"Eligible":"Not Eligible";
    raffleStatusEl.className = totalTickets>0?"eligible":"not-eligible-text";
    document.getElementById("raffleTickets").innerText=totalTickets;
    document.getElementById("maxTickets").innerText=totalTickets;
  });

});
