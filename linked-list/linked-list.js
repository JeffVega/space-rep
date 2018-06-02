class _Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    insertFirst(item) {

        this.head = new _Node(item, this.head);
    }

    insertLast(item) {
        if (this.head === null) {
            this.insertFirst(item);
        } else {
            let tempNode = this.head;

            while (tempNode.next !== null) {
                tempNode = tempNode.next;
            }
            tempNode.next = new _Node(item, null);
        }
    }

    find(item) {
        let currNode = this.head;
        if (!this.head) {
            return null;
        }

        while (currNode.value !== item) {

            if (currNode.next === null) {
                return null;
            } else {

                currNode = currNode.next;
            }
        }

        return currNode;
    }

    insertAfter(item, after) {
        if (!this.head) {
            return null;
        }
        let currNode = this.find(after);
        if (currNode) {
            let nextNode = currNode.next;
            currNode.next = new _Node(item, nextNode);
            return
        }
    }


    insertAt(item, position) {
        if (this.head === null) {
            this.insertFirst(item);
        } else {
            let currNode = this.head;
            let previousNode = this.head;
            let counter = 0;
            while (counter !== position) {
                previousNode = currNode;
                currNode = currNode.next;
                counter++;
            }
            let newItem = new _Node(item);
            previousNode.next = newItem;
            newItem.next = currNode;
        }
    }

    display(item) {
        if (item.head) {
            console.log(item.head.value);
        }
        if (!item.head) {
            console.log('The item is empty');
        }

        let currNode = item.head;

        while (currNode.next !== null) {
            console.log(currNode.next.value);
            currNode = currNode.next;
        }
    }

    isEmpty(item) {
        if (!item.head) {
            console.log('This item is empty');
            return;
        } else {
            return false;
        }
    }
    findPrevious(item, prev) {
        if (!item.head) {
            return;
        }

        let currNode = item.head;
        let prevNode = item.head;

        while (currNode.value !== prev) {
            prevNode = currNode;
            currNode = currNode.next;
        }

        console.log('Prev Node:', prevNode.value);
        return prevNode.value;
    }
    findLast(item) {
        if (!item.head) {
            return;
        }

        let currNode = item.head;

        while (currNode.next !== null) {
            currNode = currNode.next;
        }

        console.log('Last Item:', currNode.value);
        return currNode.value;
    }
     remove(item){ 
        //if the list is empty
        if (!this.head){
            return null;
        }
        //if the node to be removed is head, make the next node head
        if(this.head === item){
            this.head = this.head.next;
            return;
        }
        //start at the head
        let currNode = this.head;
        //keep track of previous
        let previousNode = this.head;
        while ((currNode !== null) && (currNode.value !== item)) {
            //save the previous node 
            previousNode = currNode;
            currNode = currNode.next;
        }
        if(currNode === null){
            console.log('Item not found');
            return;
        }
        previousNode.next = currNode.next;
    }
}
function size(item) {

    let num = 0;
    if (item.head) {
        num = 1;
    } else {
        console.log('The item is empty');
    }

    let currNode = item.head;

    while (currNode.next !== null) {
        num++;
        currNode = currNode.next;
    }
    return num;
}

function displayFirstQuestion(list) {

    return list.head
  }
  

  
  function displayAndRemove(list) {
    displayFirstQuestion(list);
  
    const firstQues = list.head
   

    list.remove(firstQues);
    
    return list;
  }
module.exports = {LinkedList,size,displayFirstQuestion,displayAndRemove}