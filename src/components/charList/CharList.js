import { Component } from 'react/cjs/react.production.min';
import './charList.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charsEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharsLoading();

        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({ offset, chars }) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charsEnded: ended
        }))
    }

    onCharsLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onError = () => {
        this.setState({ error: true, loading: false });
    }

    refArr = [];

    pushRefKays = elem => {
        this.refArr.push(elem);
    }

    focusItem = (target) => {
        this.refArr.forEach((el, i) => {
            el.classList.remove('char__selected')
            if (el == target) {
                el.classList += ' char__selected';
                el.focus();
            }
        })

    }

    renderItems = (arr) => {

        const items = arr.map(item => {
            const clazz = item.thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ?
                { objectFit: 'unset' } : null;
            return (
                <li className="char__item char__item_selected"
                    tabIndex={0}
                    key={item.id}
                    ref={this.pushRefKays}
                    onClick={(e) => {
                        this.props.onCharSelected(item.id);
                        this.focusItem(e.target.parentNode);
                    }}
                    onKeyDown={(e) => {
                        if (e.key == ' ' || e.key == 'Enter') {
                            this.props.onCharSelected(item.id);
                            this.focusItem(e.target);
                        }
                    }}
                >
                    <img src={item.thumbnail} style={clazz} alt="abyss" />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { chars, error, loading, newItemLoading, offset, charsEnded } = this.state;
        const items = this.renderItems(chars);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(errorMessage || spinner) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ display: charsEnded ? 'none' : 'block' }}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;