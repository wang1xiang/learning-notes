/** 
 * 思路：将每个节点的指针指向该节点的前驱节点
 * 1. 每个节点设置三个指针：前驱节点、当前节点、后驱节点
 * 2. 当前节点head，将head.next指向head，并删除head指向head.next的指针，递归调用
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  if (!head || !head.next) {
    return head;
  }
  let res = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return res;
};
