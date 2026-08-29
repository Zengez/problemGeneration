"Suitably Nice" Problem Philosophy and Generator.

Instructors will frequently use words like "suitably nice" when discussing a specific problem/exercise for students in a subject. Although we all know what we mean by this phrase, it is still vague enough that it becomes difficult to pin down the exact line between a problem that is truly "suitably nice" and a problem that is *almost* "suitably nice".

With this in mind, and after hundreds of conversations with fellow instructors and teaching assistants on this topic, I have decided to create this repository with the aim to accomplish a few specific things.

1) First and foremost, to come up with an objective list of criteria that defines what I mean by "suitably nice". 
	a) There is a general list of such criteria at the bottom of this README that are the criteria that (with few exceptions) apply to any/all problems - along with a discussion of why they are included and what specifically is necessary to match the criteria. 
	b) Note that this is not to imply my criteria should be considered the "correct" criteria. Rather the purpose here is to make it absolutely transparent what criteria I am using so that others may decide for themselves if they want to use the problems contained in this repository as-is, or if they want to make any particular changes to them to reflect their own criteria.

2) Create a database of individual problem files. Each File contains a...
	a) Single general problem form/type - e.g. a "factor by grouping" file, and a "factor using AC-method" file, etc.
	b) Explicitly written example of the general format/prompt of the type of problem generated - e.g. "Factor the following polynomial using AC-method: p(x) = expand( (ax-b)(cx-d) )" or "Factor the following polynomial using AC-method: p(x) = ax^2+bx+c".
	c) Discussion of what criteria from the general list may not apply to this specific problem type and the reason why, along with a discussion of any *additional* criteria that are applied to this specific problem type and why (like with the general criteria).
	d) Discussion of a generation algorithm, how exactly it works, and what was considered when designing the alogirthm. This is intended as a more mathematical heuristic or legitimate proof of how the generation method will give the type of problem the file claims to generate.
	e) (When able/appropriate) Javascript or sage/python function that generates actual concrete examples of the function using the given algorithm.
	f) List of tags that reflect the content of that file, e.g. "TAGS: Polynomials, AC Method, Factoring", or "TAGS: Exponentials, Graphing, Derivatives, Points of Inflection, Extrema, Intercepts".

3) Next I have included a searchable (by tags) interface to easily find problem files for instructors or teachers that are looking for specific problems forms, types, etc. Currently the interface can be found here: https://zengez.github.io/problemGeneration/

4) This is a public repository for those that wish to contribute and/or those that wish to use the fruits of the content.
	a) I ultimately aim to have "suitably nice" problems for everything from a precalculus level class in high school, through the entire calculus (and possibly linear algebra) university course. Clearly that is an ambitious goal, so this is likely to take a while to flesh out - so help is appreciated!
	b) Keep in mind that, part of the point of writing out the criteria of "suitably nice" explicitly is so that those that decide to contribute know what criteria are required of problem files that will be ultimately accepted via pull request. As mentioned above, exceptions may occur on a problem-by-problem basis, but those exceptions must be well documented and supported with compelling reasons before the relevant problem file would be accepted into the repository.




** Global Properties to be a "Suitably Nice Problem" **


