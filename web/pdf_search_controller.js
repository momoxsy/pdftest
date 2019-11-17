/**
 * @description 搜索列表功能
 * @author momoxsy
 * @date 2019/10/28
 */
class PDFSearchController {
    constructor() {
        this._reset();
        this._query = '';
        this._searchMatchIndexs = {};
        this._searchMatchText = {};
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

    _setActiveSearch(query, pageContents, pageMatchs) {
        if(!query || !pageContents) {
            return ;
        }

        // let searchMatchText = [];
        // let searchMatchIndex = [];

        // this._pageContents.split(' ').map((singlePageTexts)=> {
        //     let singlePageMatchText = [];
        //     let singlePageMatchIndex = [];
        //     let currentIndex = 0;
        //     singlePageTexts.map((item, index)=> {
        //         const selectIndex = item.indexOf(query);
        //         if(selectIndex !== -1) {
        //             singlePageMatchIndex.push(currentIndex + selectIndex);
        //             singlePageMatchText.push(this._getSinglePageMatchText(singlePageTexts, index));
        //         }
        //         currentIndex += item.length;
        //     });
        //     searchMatchText.push(singlePageMatchText);
        //     searchMatchIndex.push(singlePageMatchIndex);
        // });
        let searchMatchText = [];
        pageContents.map(singlePageContent => {
            let currentIndex = 0;
            let singlePageMatchText = [];
            let contentArr = singlePageContent.split(' ');
            contentArr.map((item, index)=> {
                const selectIndex = item.indexOf(query);
                if(selectIndex !== -1) {
                    singlePageMatchText.push(this._getSinglePageMatchText(contentArr, index));
                }
                currentIndex += item.length;
            })
            searchMatchText.push(singlePageMatchText);
        })
        this._searchMatchIndexs[query] = pageMatchs;
        this._searchMatchText[query] = searchMatchText;
        this.setPageContents(pageContents);
    }

    _getSinglePageMatchText(items, index) {
        let preText = index === 0 ? '' : items[index - 1];
        let nextText = index + 1 > items.length ? '' : items[index + 1];

        return [preText, items[index], nextText].join(' ');
    }

    _getActivitySearch(query, index, noMatchCBFn) {
        const currentSearchMatchIndex = this._searchMatchIndexs[query];
        let i = 0;
        for(; i < currentSearchMatchIndex.length; i++) {
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
    _insertQuerySearch(query) {
        const $searchList = document.getElementById('searchListView');
        const queryTpl = `<div class="singleQuery">
                            <div>
                                <span class="query">{{query}}</span>
                                <span class="close" data-query={{query}}>X</span>
                            </div>
                            <div class="textList" data-query={{query}}>{{textList}}</div>
                        </div>`;
        const textTpl = `<div class="text" data-index={{index}}>{{text}}</div>`;
        let index = 0;
        const $textList = this._searchMatchText[query].map((text) => {
            return text.map(t => {
                index ++;
                return textTpl.replace('{{index}}', index).replace('{{text}}', text);
            })
        });

        $searchList.innerHTML +=
            queryTpl.replace(/{{query}}/g, query)
                .replace('{{textList}}', $textList.join(''));
    }

}
const pdfSearchController = new PDFSearchController();
export { pdfSearchController };
