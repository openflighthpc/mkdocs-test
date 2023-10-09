const templateData = [
    {
      "id": "slurm-team-edition",
      "title": "SLURM: Team Edition",
      "tagline": "A small collaborative environment, great for teams running short projects.",
      "num_users": 10, // maximum number of users
      "lifetime": 3,   // maximum recommended lifetime (months)
      "storage": 1000, // storage (GB)
      "cost": 10,      // estimated running costs ($ per day)
      "capability": 1, // number of muscly arms (1-3)
    },
    {
      "id": "big-data",
      "title": "Big data: Bootstrap",
      "tagline": "Enough power and storage for crunching your big datasets.",
      "num_users": 1,
      "lifetime": 12,
      "storage": 5000,
      "cost": 15,
      "capability": 2,
    },
    {
      "id": "container-cruncher-small",
      "title": "Container Cruncher (small)",
      "tagline": "A small single-user Kubernetes environment, suitable for evaluating workflows and running a few microservices.",
      "num_users": 1,
      "lifetime": 3,
      "storage": 100,
      "cost": 10,
      "capability": 1,
    }
  ];

const filterData = [
  {
    "name": "Number of users",
    "filter": "num_users",
    "icon": "fa-users",
    "options": ['Single user', 'Multiple users'],
    "thresholds": [1],
  },
  {
    "name": "Max lifetime",
    "filter": "lifetime",
    "icon": "fa-clock",
    "options": ['Up to 6 months', '6 - 12 months', 'Over 1 year'],
    "thresholds": [6, 12],
  },
  {
    "name": "Storage",
    "filter": "storage",
    "icon": "fa-database",
    "options": ['Up to 1TB', '1 - 5TB', 'Over 5TB'],
    "thresholds": [1000, 5000],
  },
  {
    "name": "Estimated cost",
    "filter": "cost",
    "icon": "fa-credit-card",
    "options": ['Free', 'Up to $10 per day', 'Over $10 per day'],
    "thresholds": [0, 10],
  },
  {
    "name": "Capability",
    "filter": "capability",
    "icon": "fa-dumbbell",
    "options": [1, 2, 3],
    "thresholds": [1, 2],
  }
]

const capabilityAlt = ["Low", "Medium", "High"];

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#template-content')) {
    document.querySelector('.md-content__inner').classList.add('template-page-padding');

    let templateID = document.getElementById('template-content').dataset.template;
    inputData(templateData.find(template => template.id === templateID), document);
  }

  if (document.querySelector('#warehouse')) {
    addCards();
    addFilters();
    addFilterDropdowns();
  }
});

function addCards() {
  const blankCard = document.getElementById('blank-template-card');
  for (let i = 0; i < templateData.length; i++) {
    let templateCard = blankCard.cloneNode(true);
    let id = templateData[i].id;
    templateCard.id = id;
    templateCard.href = id;
    templateCard.style.display = 'grid';
    templateCard.querySelector('img').src = `../assets/images/template-icons/${id}.svg`;
    inputData(templateData[i], templateCard);
    document.getElementById('warehouse').append(templateCard);
  }
}

function inputData(templateData, container) {
  let titles = container.getElementsByClassName('template-title');
  for (let i = 0; i < titles.length; i++) {
    titles[i].innerHTML = templateData['title'];
  }
  const keys = Object.keys(templateData);
  for (let i = 0; i < keys.length; i++) {
    let el = container.querySelector(`.${keys[i]}`);
    if (el !== null) {
      if (keys[i] === 'num_users') {
        setNumUsers(templateData['num_users'], el);
      } else if (keys[i] === 'lifetime') {
        setLifetime(templateData['lifetime'], el);
      } else if (keys[i] === 'storage') {
        setStorage(templateData['storage'], el);
      } else if (keys[i] === 'cost') {
        el.innerHTML = `$${templateData['cost']} / day`;
      } else if (keys[i] === 'capability') {
        setCapability(templateData['capability'], container);
      } else {
        el.innerHTML = templateData[keys[i]];
      }
    }
  }

  function setNumUsers(numUsers, el) {
    if (numUsers.length > 1) {
      el.innerHTML = numUsers.join(' - ');
    } else {
      el.innerHTML = numUsers;
    }
  }

  function setLifetime(lifetime, el) {
    if (lifetime >= 12) {
      const years = Math.floor(lifetime/12);
      el.innerHTML = `${years} ${pluralize(years, 'year')}`;
    } else {
      el.innerHTML = `${lifetime} ${pluralize(lifetime, 'month')}`;
    }
  }

  function pluralize(num, noun) {
    return `${noun}${num > 1 ? "s" : ""}`;
  }

  function setStorage(gb, el) {
    if (gb >= 1000) {
      const tb = Math.round(gb * 10 / 1000) / 10;
      el.innerHTML = `${tb}TB`;
    } else {
      el.innerHTML = `${gb}GB`;
    }
  }

  function setCapability(capability, container) {
    const musclyArms = container.getElementsByClassName('muscly-arm');
    for (let i = 0; i < capability; i++) {
      musclyArms[i].style.filter = "brightness(1) saturate(1)";
    }
    container.querySelector('.capability .muscly-arm-container').setAttribute('aria-label', capabilityAlt[capability - 1]);
  }
}

function addFilters() {
  const blankFilter = document.getElementById('blank-filter-container');
  for (let i = 0; i < filterData.length; i++) {
    let filter = blankFilter.cloneNode(true);
    let data = filterData[i];
    filter.querySelector('.template-stats-icon').classList.add(data['icon']);
    filter.querySelector('.filter span').innerHTML = data['name'];
    let dropdown = filter.querySelector('.dropdown-options');
    let filterType = data['filter'];
    let options = filterOptions(filterType, data['options']);
    for (let i = 0; i < options.length; i++) {
      let option = `
        <label class="dropdown-option" for="${filterType}-${i}">
          <input
            type="checkbox"
            id="${filterType}-${i}"
            class="checkbox"
            data-number="${i}"
            data-type="${filterType}"
            onclick="applyFilters()"
          >
          ${options[i]}
        </label>
        <br>
      `;
      dropdown.innerHTML += option;
    }
    filter.style.display = 'inherit';
    filter.id = `${data['filter']}-filter-container`;
    filter.classList.add('filter-container');
    document.getElementById('filter-bar').append(filter);
  }
}

function filterOptions(filterType, filterOptions) {
  if (filterType === 'capability') {
    let numOptions = filterOptions.length;
    let options = new Array(numOptions);
    const musclyArm = document.querySelector('.muscly-arm').cloneNode(true);
    musclyArm.style.filter = "brightness(1) saturate(1)";
    const musclyArmHTML = musclyArm.outerHTML;
    for (let i = 1; i <= numOptions; i++) {
      options[i - 1] = "";
      for (let j = 1; j <= i; j++) {
        options[i - 1] += musclyArmHTML;
      }
    }
    return options;
  }
  return filterOptions;
}

function addFilterDropdowns() {
  let filters = document.getElementsByClassName('filter-container');
  for (let i = 0; i < filters.length; i++) {
    let filter = filters[i];
    let chevron = filter.querySelector('.fa-chevron-down');
    let dropdown = filter.querySelector('.dropdown-container');
    filter.querySelector('.filter').addEventListener('click', () => {
      if (dropdown.offsetParent === null) {
        hideAllDropdowns();
        dropdown.style.display = "block";
        chevron.style.rotate = "180deg";
      } else {
        hideDropdown(dropdown, chevron);
      }
    });
  }

  function hideAllDropdowns() {
    for (let i = 0; i < filters.length; i++) {
      let filter = filters[i];
      let dropdown = filter.querySelector('.dropdown-container');
      if (dropdown.offsetParent !== null) {
        hideDropdown(dropdown, filter.querySelector('.fa-chevron-down'))
      }
    }
  }

  function hideDropdown(dropdown, chevron) {
    dropdown.style.display = "none";
    chevron.style.rotate = "0deg";
  }
}

function applyFilters() {
  let passed = [];
  for (let i = 0; i < filterData.length; i++) {
    const filterGroup = document.getElementById(`${filterData[i]['filter']}-filter-container`);
    const passedGroup = templatesThatPassFilterGroup(filterGroup);
    if (i === 0) {
      passed = passedGroup;
    } else {
      passed = passed.filter(template => passedGroup.includes(template));
    }
  }
  for (let i = 0; i < templateData.length; i++) {
    let id = templateData[i].id;
    let template = document.getElementById(id);
    if (template.offsetParent === null && passed.includes(id)) {
      template.style.display = "grid";
    } else if (template.offsetParent !== null && !passed.includes(id)) {
      template.style.display = "none";
    }
  }

  function templatesThatPassFilterGroup(filterGroup) {
    const checkboxes = Array.from(filterGroup.querySelectorAll(`.checkbox`));
    const selected = checkboxes.filter(checkbox => checkbox.checked);
    let passed = [];
    if (selected.length === checkboxes.length || selected.length === 0) {
      passed = templateData.map(template => template.id);
    } else {
      for (let i = 0; i < selected.length; i++) {
        passed = passed.concat(templatesThatPassFilter(selected[i]));
      }
    }
    return passed;
  }

  function templatesThatPassFilter(cb) {
    const filterNum = Number(cb.dataset.number);
    const filterType = cb.dataset.type;
    const filterThresholds = filterData.find(data => data['filter'] === filterType)['thresholds'];
    let filterThreshold;
    if (filterNum === 0) {
      filterThreshold = filterThresholds[filterNum];
      return templateData.filter(template => template[filterType] <= filterThreshold).map(template => template.id);
    } else if (filterNum === filterThresholds.length) {
      filterThreshold = filterThresholds[filterThresholds.length - 1];
      return templateData.filter(template => template[filterType] > filterThreshold).map(template => template.id);
    } else {
      filterThreshold = filterThresholds.slice(filterNum - 1, filterNum + 1);
      if (filterType === 'capability') {
        return templateData.filter(template => template['capability'] === 2).map(template => template.id);
      }
      return templateData.filter(template => template[filterType] >= filterThreshold[0] && template[filterType] <= filterThreshold[1]).map(template => template.id);
    }
  }
}
