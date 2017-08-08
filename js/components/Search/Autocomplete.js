function Node(data) {
  this.data = data; 
  this.isWord = false;
  this.prefixes = 0;
  this.children = {};
}


function Trie() {
  this.root = new Node('');
  this._addNode = function(node, word) {
    if (!node || !word) return null;
    node.prefixes++;
    const letter = word.charAt(0);
    let child = node.children[letter];
    if (!child) {
      child = new Node(letter);
      node.children[letter] = child;
    }
    const remainder = word.substring(1);
    if (!remainder) {
      child.isWord = true;
    }
    this._addNode(child, remainder);
  };
  this.add = function(word) {
    if (!this.root) return null;
    this._addNode(this.root, word);
  };
  this._removeNode = function(node, word) {
    if (!node || !word) return;
    node.prefixes--;
    const letter = word.charAt(0);
    let child = node.children[letter];
    if (child) {
      const remainder = word.substring(1);
      if (remainder) {
        if (child.prefixes === 1) delete node.children[letter];
        else this._removeNode(child, remainder);
      } else {
        if (child.prefixes === 0) delete node.children[letter];
        else child.isWord = false;
      }
    }
  };
  this._contains = function(node, word) {
    if (!node || !word) return false;
    const letter = word.charAt(0);
    let child = node.children[letter];
    if (child) {
      const remainder = word.substring(1);
      if (!remainder && child.isWord) return true;
      else return this._contains(child, remainder);
    } else {
      return false;
    }
  };
  this.contains = function(word) {
    if (!this.root) return false;
    return this._contains(this.root, word);
  };
  this.remove = function(word) {
    if (!this.root) return;
    if (this.contains(word)) this._removeNode(this.root, word);
  };
}


