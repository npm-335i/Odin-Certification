import "./restaurant.css";
const HomeModule = (() => {
  function render() {
    const container = document.createElement("div");
    container.className = "tab-content";

    container.innerHTML = `

      <section class="home-hero">

        <div class="hero-text">

          <h1>
            Welcome to
            <span>Flavor Haven</span>
          </h1>

          <p>
            Fresh ingredients, crafted dishes,
            and a memorable dining experience.
          </p>

        </div>


        <div class="hero-image">
          Flavor
        </div>

      </section>


      <section class="home-info">

        <div class="card">
          <h3>Fresh Ingredients</h3>
          <p>
            Carefully selected seasonal produce.
          </p>
        </div>


        <div class="card">
          <h3>Expert Chefs</h3>
          <p>
            Skilled cooking with attention to detail.
          </p>
        </div>


        <div class="card">
          <h3>Premium Experience</h3>
          <p>
            Quality meals in a comfortable setting.
          </p>
        </div>


      </section>

    `;

    return container;
  }

  return { render };
})();

const MenuModule = (() => {
  const items = [
    {
      name: "Truffle Risotto",
      price: "$24",
      desc: "Creamy rice, mushrooms and parmesan.",
    },

    {
      name: "Grilled Octopus",
      price: "$28",
      desc: "Charred seafood with rich spices.",
    },

    {
      name: "Lamb Tagine",
      price: "$32",
      desc: "Slow cooked lamb with couscous.",
    },

    {
      name: "Burrata Salad",
      price: "$18",
      desc: "Fresh tomatoes, basil and dressing.",
    },

    {
      name: "Chocolate Fondant",
      price: "$12",
      desc: "Warm chocolate dessert.",
    },

    {
      name: "Espresso Martini",
      price: "$14",
      desc: "Coffee inspired signature drink.",
    },
  ];

  function render() {
    const container = document.createElement("div");

    container.className = "tab-content";

    container.innerHTML = `

      <h2 class="tab-title">
        Our Menu
      </h2>


      <p class="tab-sub">
        Crafted dishes prepared daily.
      </p>


      <div class="menu-grid">

        ${items
          .map(
            (item) => `

          <article class="menu-item">

            <h3>
              ${item.name}
            </h3>

            <span class="price">
              ${item.price}
            </span>


            <p>
              ${item.desc}
            </p>


          </article>


        `,
          )
          .join("")}


      </div>

    `;

    return container;
  }

  return { render };
})();

const ContactModule = (() => {
  function render() {
    const container = document.createElement("div");

    container.className = "tab-content";

    container.innerHTML = `


      <div class="contact-wrap">


        <section class="contact-info">


          <h2>
            Get in Touch
          </h2>


          <p>
            Contact us for reservations,
            events and questions.
          </p>



          <div class="contact-details">


            <div class="detail">
              123 Flavor Street,
              Food City
            </div>


            <div class="detail">
              (555) 123-4567
            </div>


            <div class="detail">
              hello@flavorhaven.com
            </div>


            <div class="detail">
              Monday - Saturday:
              11 AM - 11 PM
            </div>


          </div>


        </section>




        <form class="contact-form">


          <h3>
            Send a Message
          </h3>


          <input
            type="text"
            placeholder="Your name"
          />


          <input
            type="email"
            placeholder="Email address"
          />


          <textarea
            rows="4"
            placeholder="Your message">
          </textarea>


          <button type="button">
            Send Message
          </button>


        </form>


      </div>

    `;

    return container;
  }

  return { render };
})();

const TabController = (() => {
  const content = document.getElementById("content");

  const buttons = document.querySelectorAll("header button");

  const modules = {
    home: HomeModule,

    menu: MenuModule,

    contact: ContactModule,
  };

  let activeTab = "home";

  function renderTab(tab) {
    const selected = modules[tab];

    if (!selected) return;

    content.replaceChildren(selected.render());

    buttons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tab);
    });

    activeTab = tab;
  }

  function init() {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.tab;

        if (tab && tab !== activeTab) {
          renderTab(tab);
        }
      });
    });

    renderTab("home");
  }

  return {
    init,

    renderTab,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  TabController.init();
});
