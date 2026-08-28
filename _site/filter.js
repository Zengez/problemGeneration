"use strict";

let indexData = null;

const state = {
    include: new Set(),
    exclude: new Set(),
    search: "",
};

const includeTagsElement =
    document.getElementById("includeTags");

const excludeTagsElement =
    document.getElementById("excludeTags");

const resultsElement =
    document.getElementById("results");

const resultCountElement =
    document.getElementById("resultCount");

const noResultsElement =
    document.getElementById("noResults");

const searchElement =
    document.getElementById("search");

const clearFiltersElement =
    document.getElementById("clearFilters");


function normalize(value) {
    return value.toLocaleLowerCase();
}


function makeTagCheckbox(tag, mode) {
    const wrapper = document.createElement("label");
    wrapper.className = "tag-choice";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = tag;

    const text = document.createElement("span");
    text.textContent = tag;

    checkbox.addEventListener("change", () => {
        const thisSet =
            mode === "include"
                ? state.include
                : state.exclude;

        const otherSet =
            mode === "include"
                ? state.exclude
                : state.include;

        if (checkbox.checked) {
            thisSet.add(tag);

            /*
             * A tag cannot simultaneously be required and excluded.
             */
            if (otherSet.has(tag)) {
                otherSet.delete(tag);

                const selector =
                    `input[value="${CSS.escape(tag)}"]`;

                const otherContainer =
                    mode === "include"
                        ? excludeTagsElement
                        : includeTagsElement;

                const otherCheckbox =
                    otherContainer.querySelector(selector);

                if (otherCheckbox) {
                    otherCheckbox.checked = false;
                }
            }
        }
        else {
            thisSet.delete(tag);
        }

        renderResults();
    });

    wrapper.appendChild(checkbox);
    wrapper.appendChild(text);

    return wrapper;
}


function buildTagControls() {
    includeTagsElement.replaceChildren();
    excludeTagsElement.replaceChildren();

    for (const tag of indexData.tags) {
        includeTagsElement.appendChild(
            makeTagCheckbox(tag, "include")
        );

        excludeTagsElement.appendChild(
            makeTagCheckbox(tag, "exclude")
        );
    }
}


function matchesTags(file) {
    const normalizedFileTags =
        new Set(file.tags.map(normalize));

    for (const tag of state.include) {
        if (!normalizedFileTags.has(normalize(tag))) {
            return false;
        }
    }

    for (const tag of state.exclude) {
        if (normalizedFileTags.has(normalize(tag))) {
            return false;
        }
    }

    return true;
}


function matchesSearch(file) {
    const query = state.search.trim().toLocaleLowerCase();

    if (!query) {
        return true;
    }

    const searchable = [
        file.title,
        file.file,
        ...file.tags,
    ]
        .join(" ")
        .toLocaleLowerCase();

    return searchable.includes(query);
}


function makeResult(file) {
    const article = document.createElement("article");
    article.className = "result";

    const heading = document.createElement("h3");

    const link = document.createElement("a");
    link.href = encodeURI(file.url);
    link.textContent = file.title;

    heading.appendChild(link);

    const filename = document.createElement("div");
    filename.className = "filename";
    filename.textContent = file.file;

    const tagContainer = document.createElement("div");
    tagContainer.className = "result-tags";

    for (const tag of file.tags) {
        const tagElement = document.createElement("span");
        tagElement.className = "result-tag";
        tagElement.textContent = tag;

        tagContainer.appendChild(tagElement);
    }

    article.appendChild(heading);
    article.appendChild(filename);
    article.appendChild(tagContainer);

    return article;
}


function renderResults() {
    const matches =
        indexData.files.filter(file =>
            matchesTags(file) &&
            matchesSearch(file)
        );

    resultsElement.replaceChildren();

    for (const file of matches) {
        resultsElement.appendChild(
            makeResult(file)
        );
    }

    resultCountElement.textContent =
        `${matches.length} of ${indexData.files.length} files`;

    noResultsElement.hidden =
        matches.length !== 0;
}


function clearFilters() {
    state.include.clear();
    state.exclude.clear();
    state.search = "";

    searchElement.value = "";

    document
        .querySelectorAll(
            "#includeTags input, #excludeTags input"
        )
        .forEach(input => {
            input.checked = false;
        });

    renderResults();
}


async function initialize() {
    try {
        const response =
            await fetch("index.json", {
                cache: "no-store",
            });

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        indexData = await response.json();

        buildTagControls();
        renderResults();
    }
    catch (error) {
        console.error(error);

        resultsElement.textContent =
            "Could not load the file index.";
    }
}


searchElement.addEventListener("input", () => {
    state.search = searchElement.value;
    renderResults();
});


clearFiltersElement.addEventListener(
    "click",
    clearFilters
);


initialize();
