import React, { useState } from "react";

export default function Dictionary(props) {
  const { dictionaryQueryResults, onLemmaClick } = props;

  if (dictionaryQueryResults.length === 0) return <>何かを選択してください</>;

  const expandedByDefault =
    dictionaryQueryResults.length === 1 &&
    dictionaryQueryResults[0].dictionaryEntries.length === 1;

  let entriesCount = 0;
  const fragments = [];

  for (let i = 0; i < dictionaryQueryResults.length; i++) {
    fragments.push(
      <React.Fragment key={i}>
        <EntriesForWord
          word={dictionaryQueryResults[i]}
          expandedByDefault={expandedByDefault}
          previousEntriesCount={entriesCount}
          onLemmaClick={onLemmaClick}
        />
      </React.Fragment>
    );
    entriesCount += dictionaryQueryResults[i].dictionaryEntries.length;
  }

  return <ul>{fragments}</ul>;
}

function EntriesForWord(props) {
  const {
    word,
    expandedByDefault,
    previousEntriesCount,
    onLemmaClick,
  } = props;

  return (
    <>
      {word.dictionaryEntries.map((entry, i) => {
        const alternateColor = (previousEntriesCount + i) % 2;

        return (
          <li
            key={i}
            style={{ listStyleType: "none" }}
            className={alternateColor ? "alternate-dictionary-entry" : ""}
          >
            <DictionaryEntry
              entry={entry}
              expandedByDefault={expandedByDefault}
              onLemmaClick={onLemmaClick}
            />
          </li>
        );
      })}
    </>
  );
}

function DictionaryEntry(props) {
  const { entry, expandedByDefault, onLemmaClick } = props;
  const [isExpanded, setIsExpanded] = useState(expandedByDefault);

  const handleClick = (ev) => {
    const selection = window.getSelection();
    if (!selection.isCollapsed) return;

    let text = selection.anchorNode.textContent;
    let offset = selection.anchorOffset;

    if (offset > 50) {
      text = text.substring(offset - 25, offset + 25);
      offset = 25;
    } else {
      text = text.substring(0, 100);
    }

    onLemmaClick(text, offset);
  };

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="link-button"
      >
        {entry.lemmas.map(l => l.kanji + "（" + l.reading + "）")}
        {entry.accents}
      </button>
      {!isExpanded ? (
        <></>
      ) : (
        <div onClick={handleClick}>
          {entry.japaneseGlosses
            .concat(entry.englishGlosses)
            .map((gloss, i) => (
              <div key={i}>{gloss}</div>
            ))}
        </div>
      )}
    </div>
  );
}
