/**
 * @description 搜索列表功能
 * @author momoxsy
 * @date 2019/10/28
 */
class PDFSearchController {
    constructor() {
        this._reset();
        this._query = '';
    }

    get activeSearch() {
        return this._activeSearch;
    }

    _reset() {
        this._activeSearch = {
            pageIdx: -1,
            matchIdx: -1,
        };
        this._searchMatchText = {};
        this._searchMatchIndex = {};
    }

    _delete(query) {
        if(this._query === query) {
            this._query = '';
            this._activeSearch = {
                pageIdx: -1,
                matchIdx: -1
            };
            delete this._searchMatchIndexs[query];
            delete this._searchMatchText[query];
        }
    }

    setPageContents(pageContents) {
        this._pageContents = pageContents;
    }

    _setActiveSearch(query) {
        if(!query || !pageContents.length) {
            return ;
        }

        let searchMatchText = [];
        let searchMatchIndex = [];
        this._pageContents.map((singlePageTexts)=> {
            let singlePageMatchText = [];
            let singlePageMatchIndex = [];
            let currentIndex = 0;
            singlePageTexts.map((item, index)=> {
                const selectIndex = item.indexOf(query);
                if(selectIndex !== -1) {
                    singlePageMatchIndex.push(currentIndex + selectIndex);
                    singlePageMatchText.push(this._getSinglePageMatchText(singlePageTexts, index));
                }
                currentIndex += item.length;
            });
            searchMatchText.push(singlePageMatchText);
            searchMatchIndex.push(singlePageMatchIndex);
        });

        this._searchMatchIndexs[query] = searchMatchIndex;
        this._searchMatchText[query] = searchMatchText;
    }

    _getSinglePageMatchText(items, index) {
        let preText = index === 0 ? '' : items[index - 1];
        let nextText = index + 1 > items.length ? '' : items[index + 1];

        return [preText, items[index], nextText].join('');
    }

    _getActivitySearch(index, noMatchCBFn) {
        const currentSearchMatchIndex = this._searchMatchIndexs[query];
        for(let i = 0; i < currentSearchMatchIndex.length; i++) {
            let matchArr = currentSearchMatchIndex[i];
            if(matchArr.length >= index) {
                this._activeSearch = {
                    matchIdx: index,
                    pageIdx: i
                };
                break;
            }else{
                index -= matchArr.length;
            }
        }
        if(i >= currentSearchMatchIndex.length) {
            noMatchCBFn&&noMatchCBFn('no match');
        }            
    }

}
const pdfSearchController = new PDFSearchController();
export { pdfSearchController };
