.PHONY: test-functional
test-functional:
	docker-compose -f ./test-functional/docker-compose.yaml up --build --exit-code-from test-suit
