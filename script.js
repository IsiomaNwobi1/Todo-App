// localStorage.clear();
// variables
let list = document.querySelector( ".todo__list" );
let add = document.getElementById( "add" );
let clearbtn = document.querySelector( ".todo--clear" );
let itemsLeftNum = document.querySelector( ".todo--num" );
// #############
// #############
defaultItems()
reload();
mode();
creatItem();
// #############
// #############


function defaultItems ()
{
  if ( !localStorage.num ) localStorage.num = 7;
  const items = [
    "Complete online JavaScript course1",
    "Jog around the park 3x",
    "10 minutes meditation",
    "Read for 1 hour",
    "Pick up groceries",
    "Complete Todo App on Frontend Mentor"
  ]
  for ( let i = 0; i < items.length; i++ )
  {
    if ( !localStorage[`item-${i+1}`] ) localStorage[`item-${i+1}`] = items[i];
  }
}
function mode ()
{
  var mode = document.querySelector( ".todo--mode" );
  mode.addEventListener( "click", () =>
  {
    mode.classList.toggle( "active" );
    document.body.classList.toggle( "dark-mode" );
  } );
}
function reload ()
{
  window.onload = function ()
  {
    let num = Object.keys( localStorage ).length;
    for ( let i = 0; i < num; i++ )
    {
      let checked = false;
      let v = Object.values( localStorage )[ i ];
      if ( v.slice( -1 ) == 1 )
      {
        v = v.slice( 0, -1 );
        checked = true;
      }
      let k = Object.keys( localStorage )[ i ];
      if ( k === "num" ) continue;
      list.innerHTML += `
      <li draggable="true" class="todo__item ${ k }">
      <input ${ checked ? "checked" : "" } id="todo--check" type="checkbox" class="todo--check"></input>
      <label class="todo--text">
        ${ v }
      </label>
      <img src="images/icon-cross.svg" class="remove" alt="cross">
      </li>`;
    }
    removeItem();
    addChecked();
    clearC();
    itemsLeft();
    filter();
    dragAndDrop()
  };
}
function creatItem ()
{
  let text = add.previousElementSibling;
  function dothat ()
  {
    if ( (text.value) !== "" )
    {
      let eNum = localStorage.getItem( "num" );
      localStorage.setItem( `item-${ eNum }`, text.value );
      list.innerHTML += `
      <li draggable="true" class="todo__item item-${ eNum }">
      <input id="todo--check" type="checkbox" class="todo--check"></input>
      <label class="todo--text">
        ${ text.value }
      </label>
      <img src="images/icon-cross.svg" class="remove" alt="cross">
      </li>`;
      localStorage.setItem( "num", +localStorage.num + 1 );
      text.value = "";
      text.focus();
      removeItem();
      addChecked();
      clearC();
      itemsLeft();
      filter();
      dragAndDrop()
    }
  }
  add.addEventListener( "click", dothat );
  text.addEventListener( "keypress", (e) =>
  {
    if(e.key === "Enter") dothat()
  })
}
function dragAndDrop ()
{
  let items = document.querySelectorAll( ".todo__item" );
  items.forEach( item =>
  {
    item.addEventListener( "dragstart", () =>
    {
      setTimeout(() => item.classList.add("dragging") ,0)
    } )
    item.addEventListener("dragend", () => item.classList.remove("dragging"))
  } )
  const init = (e) =>
  {
    e.preventDefault()
    const draggingItem = list.querySelector(".dragging")
    let siblings = [ ...list.querySelectorAll( ".todo__item:not(.dragging)" ) ]
    let nextSibling = siblings.find( sibling =>
      {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
      } )
    list.insertBefore(draggingItem, nextSibling)
  }
  list.addEventListener( "dragover", init )
  list.addEventListener("dragenter", e => e.preventDefault())
}
function removeItem ()
{
  let del = document.querySelectorAll( ".remove" );
  del.forEach( d =>
  {
    let key = d.parentElement.classList[ 1 ];
    d.addEventListener( "click", () =>
    {
      localStorage.removeItem( key );
      d.parentElement.remove();
      itemsLeft();
      filter()
    } );
  } );
}
function addChecked ()
{
  let allC = document.querySelectorAll( ".todo__list .todo--check" );
  allC.forEach( c =>
  {
    c.addEventListener( "click", () =>
    {
      if ( c.hasAttribute( "checked" ) )
      {
        c.removeAttribute( "checked" );
        let k = c.parentElement.classList[ 1 ];
        localStorage[ k ] = localStorage[ k ].slice( 0, -1 );
        clearC();
        itemsLeft();
        filter()
      }
      else
      {
        c.setAttribute( "checked", "" );
        let k = c.parentElement.classList[ 1 ];
        localStorage[ k ] += "1";
        clearC();
        itemsLeft();
        filter()
      }
    } );
  } );
}
function clearC ()
{
  clearbtn.addEventListener( "click", () =>
  {
    let allC = document.querySelectorAll( ".todo__list .todo--check[checked]" );
    allC.forEach( c =>
    {
      let key = c.parentElement.classList[ 1 ];
      localStorage.removeItem( key );
      c.parentElement.remove();
    } );
  } );
}
function itemsLeft ()
{
  let notCompleat = document.querySelectorAll( ".todo__list .todo--check:not([checked])" );
  itemsLeftNum.innerHTML = notCompleat.length;
}
function filter ()
{
  let parent = document.querySelectorAll( ".todo--filter" );
  parent.forEach( p =>
  {
    function removeActive ()
    {
      for ( let i = 0; i < p.children.length; i++ )
      {
        p.children[ i ].classList.remove( "active" );
      }
    }
    let compleat = document.querySelectorAll( ".todo__list .todo--check[checked]" );
    let notCompleat = document.querySelectorAll( ".todo__list .todo--check:not([checked])" );
    p.children[ 0 ].addEventListener( "click", () =>
    {
      removeActive();
      p.children[ 0 ].classList.add( "active" );
      compleat.forEach( o => o.parentElement.style.display = "flex" );
      notCompleat.forEach( o => o.parentElement.style.display = "flex" );
    } );
    p.children[ 1 ].addEventListener( "click", () =>
    {
      removeActive();
      p.children[ 1 ].classList.add( "active" );
      compleat.forEach( o => o.parentElement.style.display = "none" );
      notCompleat.forEach( o => o.parentElement.style.display = "flex" );
    } );
    p.children[ 2 ].addEventListener( "click", () =>
    {
      removeActive();
      p.children[ 2 ].classList.add( "active" );
      compleat.forEach( o => o.parentElement.style.display = "flex" );
      notCompleat.forEach( o => o.parentElement.style.display = "none" );
    } );
  } );
}
